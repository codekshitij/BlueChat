import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRooms() {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`, users.map(u => u.username));

    // Check if General room exists
    let generalRoom = await prisma.room.findFirst({
      where: { name: 'General' },
      include: { users: true }
    });

    if (!generalRoom) {
      // Create General room with both users
      console.log('\nCreating General room...');
      generalRoom = await prisma.room.create({
        data: {
          name: 'General',
          isEphemeral: false,
          users: {
            connect: users.map(u => ({ id: u.id }))
          }
        },
        include: { users: true }
      });
      console.log('✓ Created General room');
    } else {
      // Add any missing users to the General room
      console.log('\nGeneral room exists with members:', generalRoom.users.map(u => u.username));
      
      const missingUsers = users.filter(u => 
        !generalRoom!.users.some(roomUser => roomUser.id === u.id)
      );

      if (missingUsers.length > 0) {
        console.log('Adding missing users:', missingUsers.map(u => u.username));
        await prisma.room.update({
          where: { id: generalRoom.id },
          data: {
            users: {
              connect: missingUsers.map(u => ({ id: u.id }))
            }
          }
        });
        console.log('✓ Added users to General room');
      } else {
        console.log('All users are already members of General room');
      }
    }

    // Check for thread
    const threads = await prisma.thread.findMany({
      where: { roomId: generalRoom.id }
    });

    if (threads.length === 0) {
      console.log('\nCreating Welcome thread...');
      const thread = await prisma.thread.create({
        data: {
          title: 'Welcome Thread',
          roomId: generalRoom.id,
        }
      });

      // Add welcome messages
      await prisma.message.createMany({
        data: [
          {
            content: 'Welcome to BlueChat! This is a test message.',
            userId: users[0].id,
            threadId: thread.id,
          },
          {
            content: 'Hello everyone! Excited to chat here.',
            userId: users[1]?.id || users[0].id,
            threadId: thread.id,
          }
        ]
      });
      console.log('✓ Created Welcome thread with messages');
    }

    // Verify final state
    const finalRoom = await prisma.room.findFirst({
      where: { name: 'General' },
      include: {
        users: { select: { username: true } },
        threads: true,
        _count: { select: { users: true, threads: true } }
      }
    });

    console.log('\n=== Final State ===');
    console.log('Room:', finalRoom?.name);
    console.log('Members:', finalRoom?.users.map(u => u.username).join(', '));
    console.log('Thread count:', finalRoom?._count.threads);
    console.log('Member count:', finalRoom?._count.users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRooms();
