import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    }
  });
  
  console.log('\n=== USERS ===');
  console.log(`Total users: ${users.length}`);
  users.forEach(user => {
    console.log(`- ${user.username} (${user.email}) - ID: ${user.id}`);
  });
  
  // Get all rooms
  const rooms = await prisma.room.findMany({
    include: {
      users: {
        select: {
          id: true,
          username: true,
        }
      },
      threads: true,
    }
  });
  
  console.log('\n=== ROOMS ===');
  console.log(`Total rooms: ${rooms.length}`);
  rooms.forEach(room => {
    console.log(`\n- ${room.name} (ID: ${room.id})`);
    console.log(`  Members: ${room.users.map(u => u.username).join(', ')}`);
    console.log(`  Threads: ${room.threads.length}`);
    console.log(`  Ephemeral: ${room.isEphemeral}`);
    console.log(`  Expires: ${room.expiresAt || 'Never'}`);
  });
  
  // If there's a room but the logged-in user isn't a member, add them
  if (rooms.length > 0 && users.length > 0) {
    for (const room of rooms) {
      const missingUsers = users.filter(user => 
        !room.users.some(roomUser => roomUser.id === user.id)
      );
      
      if (missingUsers.length > 0) {
        console.log(`\n=== ADDING USERS TO ROOM "${room.name}" ===`);
        for (const user of missingUsers) {
          await prisma.room.update({
            where: { id: room.id },
            data: {
              users: {
                connect: { id: user.id }
              }
            }
          });
          console.log(`✓ Added ${user.username} to ${room.name}`);
        }
      }
    }
  }
}

checkDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
