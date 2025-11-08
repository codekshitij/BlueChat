import { Router, type Router as ExpressRouter } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from './middleware/auth';

const prisma = new PrismaClient();
const router: ExpressRouter = Router();

// Get messages in a thread
router.get('/threads/:threadId/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { threadId },
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Post a message in a thread
router.post('/threads/:threadId/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message content required' });
  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId: req.user?.userId!,
        threadId,
      },
      include: { user: { select: { id: true, username: true } } },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
