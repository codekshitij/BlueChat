#!/usr/bin/env node

// Simple test script to verify rooms query
// Run this with: node test-rooms-query.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRoomsQuery() {
  try {
    console.log('\n=== Testing Rooms Query ===\n');
    
    // First, let's find Alice's user ID
    const alice = await prisma.user.findUnique({
      where: { email: 'alice@example.com' }
    });
    
    if (!alice) {
      console.log('❌ Alice user not found!');
      return;
    }
    
    console.log('✅ Found Alice:');
    console.log('  - ID:', alice.id);
    console.log('  - Username:', alice.username);
    console.log('  - Email:', alice.email);
    
    // Now let's query rooms the same way the API does
    console.log('\n--- Querying rooms for Alice ---');
    const rooms = await prisma.room.findMany({
      where: { 
        users: { 
          some: { 
            id: alice.id 
          } 
        } 
      },
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
    
    console.log(`\n✅ Found ${rooms.length} room(s) for Alice:\n`);
    
    if (rooms.length === 0) {
      console.log('❌ No rooms found! This is the problem!');
      
      // Let's check if Alice is actually in any rooms
      console.log('\n--- Checking user-room relationships ---');
      const userWithRooms = await prisma.user.findUnique({
        where: { id: alice.id },
        include: { rooms: true }
      });
      
      console.log(`Alice is in ${userWithRooms?.rooms.length || 0} room(s):`);
      userWithRooms?.rooms.forEach(room => {
        console.log(`  - ${room.name} (ID: ${room.id})`);
      });
      
    } else {
      rooms.forEach((room, idx) => {
        console.log(`${idx + 1}. ${room.name}`);
        console.log(`   ID: ${room.id}`);
        console.log(`   Members: ${room.users.map(u => u.username).join(', ')}`);
        console.log(`   Threads: ${room._count.threads}`);
        console.log(`   Ephemeral: ${room.ephemeral}`);
        if (room.expiresAt) {
          console.log(`   Expires: ${room.expiresAt}`);
        }
        console.log('');
      });
    }
    
    // Let's also check the General room specifically
    console.log('\n--- Checking General Room ---');
    const generalRoom = await prisma.room.findFirst({
      where: { name: 'General' },
      include: {
        users: { select: { id: true, username: true, email: true } }
      }
    });
    
    if (generalRoom) {
      console.log('✅ General room exists:');
      console.log('  - ID:', generalRoom.id);
      console.log('  - Members:');
      generalRoom.users.forEach(user => {
        console.log(`    • ${user.username} (${user.email}) - ID: ${user.id}`);
        if (user.id === alice.id) {
          console.log('      ✅ This is Alice!');
        }
      });
    } else {
      console.log('❌ General room not found!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRoomsQuery();
