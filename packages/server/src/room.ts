import { Router, type Router as ExpressRouter } from 'express';
import { PrismaClient, Room, User, Thread, Message, RoomInvite, RoomMembership } from '@prisma/client';
import { authenticateToken, AuthRequest } from './middleware/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();
const router: ExpressRouter = Router();

// Get all rooms (user must be a member)
router.get('/rooms', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('🔍 Fetching rooms for user:', req.user?.userId, req.user?.username);
    const rooms = await prisma.room.findMany({
      where: { users: { some: { id: req.user?.userId } } },
      include: { 
        users: { select: { id: true, username: true } },
        _count: {
          select: {
            threads: true,
            users: true,
          }
        }
      },
    });
    console.log(`Found ${rooms.length} rooms for user ${req.user?.username}`);
      if (rooms.length > 0) {
        console.log('Rooms:', rooms.map((r) => ({ name: r.name, members: (r.users as User[]).map((u) => u.username) })));
      }
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room statistics
router.get('/rooms/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get active (non-expired) rooms
    const now = new Date();
    const activeRoomsCount = await prisma.room.count({
      where: {
        OR: [
          { isEphemeral: false },
          { 
            AND: [
              { isEphemeral: true },
              { expiresAt: { gt: now } }
            ]
          }
        ]
      }
    });

    // Get unique online users (users who are in at least one active room)
    const onlineUsers = await prisma.user.count({
      where: {
        rooms: {
          some: {
            OR: [
              { isEphemeral: false },
              { 
                AND: [
                  { isEphemeral: true },
                  { expiresAt: { gt: now } }
                ]
              }
            ]
          }
        }
      }
    });

    // Get messages from today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const messagesToday = await prisma.message.count({
      where: {
        createdAt: { gte: todayStart }
      }
    });

    // Calculate average room life for ephemeral rooms
    const ephemeralRooms = await prisma.room.findMany({
      where: {
        isEphemeral: true,
        expiresAt: { not: null }
      },
      select: {
        createdAt: true,
        expiresAt: true
      }
    });

    let averageRoomLife = '0h';
    if (ephemeralRooms.length > 0) {
      const totalLifeMinutes = ephemeralRooms.reduce((sum: number, room: Room) => {
        if (room.expiresAt) {
          const lifeMs = room.expiresAt.getTime() - room.createdAt.getTime();
          return sum + (lifeMs / 1000 / 60); // Convert to minutes
        }
        return sum;
      }, 0);
      
      const avgMinutes = totalLifeMinutes / ephemeralRooms.length;
      const avgHours = Math.round(avgMinutes / 60);
      averageRoomLife = `${avgHours}h`;
    }

    res.json({
      activeRooms: activeRoomsCount,
      onlineUsers,
      messagesToday,
      averageRoomLife
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Create a room
router.post('/rooms', authenticateToken, async (req: AuthRequest, res) => {
  const { name, isEphemeral, expiresAt } = req.body;
  if (!name) return res.status(400).json({ error: 'Room name required' });
  try {
    const room = await prisma.room.create({
      data: {
        name,
        isEphemeral: !!isEphemeral,
        expiresAt: isEphemeral ? expiresAt : null,
        users: { connect: { id: req.user?.userId } },
      },
      include: { users: true, threads: true },
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get threads in a room
router.get('/rooms/:roomId/threads', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  try {
    const threads = await prisma.thread.findMany({
      where: { roomId },
      include: { 
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Create a thread in a room
router.post('/rooms/:roomId/threads', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Thread title required' });
  try {
    const thread = await prisma.thread.create({
      data: {
        title,
        roomId,
      },
      include: { messages: true },
    });
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Get a single room by ID
router.get('/rooms/:roomId', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { 
        users: { select: { id: true, username: true } },
        _count: {
          select: {
            threads: true,
            users: true,
          }
        }
      },
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check if user is a member
      const isMember = room.users.some((u: any) => u.id === req.user?.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this room' });
    }
    
    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Get messages in a thread
router.get('/threads/:threadId/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  try {
    // First, verify user has access to this thread's room
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        room: {
          include: {
            users: { select: { id: true } }
          }
        }
      }
    });
    
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    const isMember = thread.room.users.some((u: User) => u.id === req.user?.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this room' });
    }
    
    const messages = await prisma.message.findMany({
      where: { threadId },
      include: {
        user: {
          select: { id: true, username: true }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
    
    // Format messages to include username at top level
      const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      threadId: msg.threadId,
      userId: msg.userId,
      username: msg.user.username,
      createdAt: msg.createdAt,
    }));
    
    res.json(formattedMessages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message in a thread
router.post('/threads/:threadId/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content required' });
  }
  
  try {
    // Verify user has access to this thread's room
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        room: {
          include: {
            users: { select: { id: true } }
          }
        }
      }
    });
    
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    const isMember = thread.room.users.some((u: User) => u.id === req.user?.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this room' });
    }
    
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        threadId,
        userId: req.user!.userId,
      },
      include: {
        user: {
          select: { id: true, username: true }
        }
      }
    });
    
    // Format message response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      threadId: message.threadId,
      userId: message.userId,
      username: message.user.username,
      createdAt: message.createdAt,
    };
    
    res.status(201).json(formattedMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create an invite link for a room
router.post('/rooms/:roomId/invite', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  const { expiresInHours = 24 } = req.body; // default: 24h
  try {
    // Check if user is a member of the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { users: { select: { id: true } } }
    });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const isMember = room.users.some((u: User) => u.id === req.user?.userId);
    if (!isMember) return res.status(403).json({ error: 'Not a member of this room' });

    // Generate a unique token
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    const invite = await prisma.roomInvite.create({
      data: {
        token,
        roomId,
        createdById: req.user!.userId,
        expiresAt,
      }
    });
    res.status(201).json({ inviteLink: `/join/${token}`, token, expiresAt });
  } catch (err) {
    console.error('Error creating invite:', err);
    res.status(500).json({ error: 'Failed to create invite' });
  }
});

// Redeem an invite link
router.post('/rooms/join/:token', authenticateToken, async (req: AuthRequest, res) => {
  const { token } = req.params;
  try {
    const invite = await prisma.roomInvite.findUnique({
      where: { token },
      include: { room: true }
    });
    if (!invite) return res.status(404).json({ error: 'Invite not found' });
    if (invite.used) return res.status(400).json({ error: 'Invite already used' });
    if (invite.expiresAt && invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invite expired' });

    // Add user to the room if not already a member
    const alreadyMember = await prisma.room.findFirst({
      where: {
        id: invite.roomId,
        users: { some: { id: req.user!.userId } }
      }
    });
    if (alreadyMember) return res.status(400).json({ error: 'Already a member of this room' });

    await prisma.room.update({
      where: { id: invite.roomId },
      data: {
        users: { connect: { id: req.user!.userId } }
      }
    });
    await prisma.roomInvite.update({
      where: { token },
      data: { used: true, usedById: req.user!.userId }
    });
    res.json({ message: 'Joined room successfully', roomId: invite.roomId });
  } catch (err) {
    console.error('Error redeeming invite:', err);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Edit room settings (name, description, privacy, etc.)
router.put('/rooms/:roomId', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  const { name, description, isPrivate, allowEditing, allowDeleting } = req.body;
  try {
    // Check if user is an admin of the room
    const membership = await prisma.roomMembership.findUnique({
      where: { userId_roomId: { userId: req.user!.userId, roomId } },
    });
    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can edit room settings' });
    }
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPrivate !== undefined && { isPrivate }),
        ...(allowEditing !== undefined && { allowEditing }),
        ...(allowDeleting !== undefined && { allowDeleting }),
      },
    });
    res.json(updatedRoom);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete a room
router.delete('/rooms/:roomId', authenticateToken, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  try {
    // Check if user is an admin of the room
    const membership = await prisma.roomMembership.findUnique({
      where: { userId_roomId: { userId: req.user!.userId, roomId } },
    });
    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can delete the room' });
    }
    await prisma.room.delete({ where: { id: roomId } });
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
