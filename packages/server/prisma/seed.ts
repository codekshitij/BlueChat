import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      password: passwordHash,
    },
  });
  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      password: passwordHash,
    },
  });

  // Create a room
  const room = await prisma.room.create({
    data: {
      name: 'General',
      isEphemeral: false,
      users: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  });

  // Create a thread
  const thread = await prisma.thread.create({
    data: {
      title: 'Welcome Thread',
      roomId: room.id,
    },
  });

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        content: 'Hello, this is Alice!',
        userId: alice.id,
        threadId: thread.id,
      },
      {
        content: 'Hi Alice, this is Bob!',
        userId: bob.id,
        threadId: thread.id,
      },
    ],
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
