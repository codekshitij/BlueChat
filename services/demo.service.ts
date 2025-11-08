import { User, Room, Message, ProximityReport } from '../types';

// Demo data for simulation - this simulates a "shared backend"
const DEMO_USERS: User[] = [
  {
    id: 'demo-user-1',
    username: 'Alex',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 'demo-user-2',
    username: 'Sarah',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 'demo-user-3',
    username: 'Mike',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 'demo-user-4',
    username: 'Emma',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 'demo-user-5',
    username: 'David',
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    lastSeen: new Date(),
    isOnline: true,
  },
];

// Shared demo rooms - all users see the same rooms
const DEMO_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Coffee Shop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    createdBy: 'demo-user-1',
    memberCount: 3,
    maxMembers: 25,
    isActive: true,
    lastActivity: new Date(),
  },
  {
    id: 'room-2',
    name: 'Library Study',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    createdBy: 'demo-user-2',
    memberCount: 2,
    maxMembers: 25,
    isActive: true,
    lastActivity: new Date(),
  },
];

// Shared demo messages - all users see the same messages
const DEMO_MESSAGES: { [roomId: string]: Message[] } = {
  'room-1': [
    {
      id: 'msg-1',
      roomId: 'room-1',
      userId: 'demo-user-1',
      username: 'Alex',
      content: 'Hey everyone! 👋',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: 'text',
    },
    {
      id: 'msg-2',
      roomId: 'room-1',
      userId: 'demo-user-2',
      username: 'Sarah',
      content: 'Hi Alex! How\'s it going?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      type: 'text',
    },
    {
      id: 'msg-3',
      roomId: 'room-1',
      userId: 'demo-user-3',
      username: 'Mike',
      content: 'Great to see you all here!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'text',
    },
  ],
  'room-2': [
    {
      id: 'msg-4',
      roomId: 'room-2',
      userId: 'demo-user-2',
      username: 'Sarah',
      content: 'Anyone studying for the exam?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text',
    },
    {
      id: 'msg-5',
      roomId: 'room-2',
      userId: 'demo-user-4',
      username: 'Emma',
      content: 'Yes! I\'m here to study too 📚',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      type: 'text',
    },
  ],
};

class DemoService {
  private discoveryInterval: NodeJS.Timeout | null = null;
  private isDiscovering = false;
  private messageListeners: { [roomId: string]: ((message: Message) => void)[] } = {};

  // Generate a random user ID
  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new user
  async createUser(username: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: User = {
      id: this.generateUserId(),
      username,
      createdAt: new Date(),
      lastSeen: new Date(),
      isOnline: true,
    };

    return user;
  }

  // Start proximity discovery
  startDiscovery(onUserFound: (user: ProximityReport) => void): void {
    if (this.isDiscovering) return;

    this.isDiscovering = true;
    
    // Simulate finding users every 2-5 seconds
    this.discoveryInterval = setInterval(() => {
      const randomUser = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
      
      const proximityReport: ProximityReport = {
        id: `proximity-${Date.now()}`,
        userId: randomUser.id,
        username: randomUser.username,
        distance: Math.random() * 50 + 5, // 5-55 meters
        signalStrength: Math.random() * 40 + 60, // 60-100%
        timestamp: new Date(),
      };

      onUserFound(proximityReport);
    }, Math.random() * 3000 + 2000); // 2-5 seconds
  }

  // Stop proximity discovery
  stopDiscovery(): void {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
    this.isDiscovering = false;
  }

  // Get available rooms
  async getAvailableRooms(): Promise<Room[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return DEMO_ROOMS.filter(room => room.isActive && room.memberCount < room.maxMembers);
  }

  // Create a new room
  async createRoom(name: string, createdBy: string): Promise<Room> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const room: Room = {
      id: `room-${Date.now()}`,
      name,
      createdAt: new Date(),
      createdBy,
      memberCount: 1,
      maxMembers: 25,
      isActive: true,
      lastActivity: new Date(),
    };

    DEMO_ROOMS.push(room);
    DEMO_MESSAGES[room.id] = []; // Initialize empty messages array
    return room;
  }

  // Join a room
  async joinRoom(roomId: string, userId: string): Promise<Room> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const room = DEMO_ROOMS.find(r => r.id === roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.memberCount >= room.maxMembers) {
      throw new Error('Room is full');
    }

    room.memberCount += 1;
    room.lastActivity = new Date();

    return room;
  }

  // Leave a room
  async leaveRoom(roomId: string, userId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const room = DEMO_ROOMS.find(r => r.id === roomId);
    if (room) {
      room.memberCount = Math.max(0, room.memberCount - 1);
      room.lastActivity = new Date();
      
      if (room.memberCount === 0) {
        room.isActive = false;
      }
    }
  }

  // Get room messages (from shared backend)
  async getRoomMessages(roomId: string): Promise<Message[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return DEMO_MESSAGES[roomId] || [];
  }

  // Send a message (to shared backend)
  async sendMessage(roomId: string, userId: string, username: string, content: string): Promise<Message> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const message: Message = {
      id: `msg-${Date.now()}`,
      roomId,
      userId,
      username,
      content,
      timestamp: new Date(),
      type: 'text',
    };

    // Add to shared messages (all users will see this)
    if (!DEMO_MESSAGES[roomId]) {
      DEMO_MESSAGES[roomId] = [];
    }
    DEMO_MESSAGES[roomId].push(message);

    // Notify all listeners about the new message
    if (this.messageListeners[roomId]) {
      this.messageListeners[roomId].forEach(listener => listener(message));
    }

    return message;
  }

  // Subscribe to room messages (for real-time updates)
  subscribeToRoom(roomId: string, onMessage: (message: Message) => void): () => void {
    if (!this.messageListeners[roomId]) {
      this.messageListeners[roomId] = [];
    }
    
    this.messageListeners[roomId].push(onMessage);
    
    // Return unsubscribe function
    return () => {
      if (this.messageListeners[roomId]) {
        this.messageListeners[roomId] = this.messageListeners[roomId].filter(
          listener => listener !== onMessage
        );
      }
    };
  }

  // Simulate user going offline
  async simulateUserOffline(userId: string): Promise<void> {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return DEMO_USERS.find(u => u.id === userId) || null;
  }

  // Update user status
  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = DEMO_USERS.find(u => u.id === userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
    }
  }

  // Simulate other users sending messages (for demo purposes)
  startSimulatedMessages(roomId: string): void {
    const demoUsers = ['Alex', 'Sarah', 'Mike', 'Emma', 'David'];
    const demoMessages = [
      'Hey everyone! 👋',
      'How\'s it going?',
      'This is a cool chat room!',
      'Anyone up for coffee later?',
      'Great to meet you all!',
      'What are you all up to?',
      'This proximity chat is pretty neat!',
      'Anyone else studying here?',
      'Love the warm colors of this app!',
      'How far away are you all?',
    ];

    setInterval(() => {
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      
      this.sendMessage(roomId, `demo-${randomUser}`, randomUser, randomMessage);
    }, 10000 + Math.random() * 20000); // Random interval between 10-30 seconds
  }
}

export const demoService = new DemoService();
