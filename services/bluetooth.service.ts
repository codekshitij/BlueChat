import { User, Room, Message, ProximityReport } from '../types';
import { localStorage } from '../utils/storage';

// Simulated Bluetooth mesh network
interface BluetoothNode {
  id: string;
  username: string;
  isHost: boolean;
  connectedPeers: string[];
  roomId?: string;
  isOnline: boolean;
  lastSeen: Date;
}

class BluetoothService {
  private currentNode: BluetoothNode | null = null;
  private meshNetwork: Map<string, BluetoothNode> = new Map();
  private messageListeners: { [roomId: string]: ((message: Message) => void)[] } = {};
  private discoveryInterval: NodeJS.Timeout | null = null;
  private isDiscovering = false;
  private autoJoinInterval: NodeJS.Timeout | null = null;

  // Initialize Bluetooth node for current user
  async initializeNode(user: User): Promise<void> {
    this.currentNode = {
      id: user.id,
      username: user.username,
      isHost: false,
      connectedPeers: [],
      isOnline: true,
      lastSeen: new Date(),
    };

    // Add to mesh network
    this.meshNetwork.set(user.id, this.currentNode);
    
    console.log(`Bluetooth node initialized for ${user.username}`);
    
    // Start simulating other devices joining
    this.startDeviceSimulation();
  }

  // Simulate other devices joining the network
  private startDeviceSimulation(): void {
    const demoUsers = [
      { id: 'demo-1', username: 'Alex' },
      { id: 'demo-2', username: 'Sarah' },
      { id: 'demo-3', username: 'Mike' },
      { id: 'demo-4', username: 'Emma' },
      { id: 'demo-5', username: 'David' },
      { id: 'demo-6', username: 'Lisa' },
    ];

    // Add demo users to mesh network
    demoUsers.forEach(user => {
      this.meshNetwork.set(user.id, {
        id: user.id,
        username: user.username,
        isHost: false,
        connectedPeers: [],
        isOnline: true,
        lastSeen: new Date(),
      });
    });

    console.log('Simulated devices added to Bluetooth mesh network');

    // Simulate devices joining rooms over time
    this.autoJoinInterval = setInterval(() => {
      this.simulateDeviceJoining();
    }, 5000); // Every 5 seconds
  }

  // Simulate a device joining a room or creating one
  private simulateDeviceJoining(): void {
    const availableNodes = Array.from(this.meshNetwork.values()).filter(
      node => !node.roomId && node.id !== this.currentNode?.id
    );

    if (availableNodes.length === 0) return;

    const randomNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
    
    // Check if there's an existing room to join
    const existingRooms = Array.from(this.meshNetwork.values()).filter(
      node => node.isHost && node.roomId
    );

    if (existingRooms.length > 0 && Math.random() > 0.3) {
      // Join existing room
      const randomRoom = existingRooms[Math.floor(Math.random() * existingRooms.length)];
      if (randomRoom.roomId) {
        this.joinRoomForNode(randomNode, randomRoom.roomId);
      }
    } else {
      // Create new room
      this.createRoomForNode(randomNode);
    }
  }

  // Create room for a simulated node
  private createRoomForNode(node: BluetoothNode): void {
    const roomNames = [
      'Coffee Shop Chat',
      'Library Study Group',
      'Park Meetup',
      'Mall Hangout',
      'Campus Lounge',
      'Downtown Spot',
    ];

    const roomName = roomNames[Math.floor(Math.random() * roomNames.length)];
    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Update node as host
    node.isHost = true;
    node.roomId = roomId;

    console.log(`${node.username} created room: ${roomName}`);

    // Simulate some initial messages
    setTimeout(() => {
      this.simulateInitialMessages(roomId, node);
    }, 2000);
  }

  // Join room for a simulated node
  private joinRoomForNode(node: BluetoothNode, roomId: string): void {
    node.roomId = roomId;
    
    // Find host and connect
    const hostNode = Array.from(this.meshNetwork.values()).find(
      n => n.roomId === roomId && n.isHost
    );
    
    if (hostNode) {
      node.connectedPeers.push(hostNode.id);
      hostNode.connectedPeers.push(node.id);
      
      console.log(`${node.username} joined room ${roomId}`);
      
      // Simulate joining message
      setTimeout(() => {
        this.simulateJoinMessage(roomId, node);
      }, 1000);
    }
  }

  // Simulate initial messages when room is created
  private async simulateInitialMessages(roomId: string, hostNode: BluetoothNode): Promise<void> {
    const messages = [
      `Hey everyone! I'm ${hostNode.username} 👋`,
      'Anyone else around here?',
      'This proximity chat is pretty cool!',
      'How far away are you all?',
    ];

    for (let i = 0; i < messages.length; i++) {
      setTimeout(async () => {
        const message: Message = {
          id: `msg-${Date.now()}-${i}`,
          roomId,
          userId: hostNode.id,
          username: hostNode.username,
          content: messages[i],
          timestamp: new Date(),
          type: 'text',
        };

        // Store in local storage
        await localStorage.addMessageToRoom(roomId, message);
        
        // Notify listeners
        if (this.messageListeners[roomId]) {
          this.messageListeners[roomId].forEach(listener => listener(message));
        }
      }, i * 2000); // 2 seconds between messages
    }
  }

  // Simulate join message
  private async simulateJoinMessage(roomId: string, node: BluetoothNode): Promise<void> {
    const joinMessages = [
      `Hi everyone! ${node.username} here 👋`,
      `Hey! ${node.username} joining the chat`,
      `Hello from ${node.username}!`,
      `${node.username} checking in`,
    ];

    const message: Message = {
      id: `msg-${Date.now()}-join`,
      roomId,
      userId: node.id,
      username: node.username,
      content: joinMessages[Math.floor(Math.random() * joinMessages.length)],
      timestamp: new Date(),
      type: 'text',
    };

    // Store in local storage
    await localStorage.addMessageToRoom(roomId, message);
    
    // Notify listeners
    if (this.messageListeners[roomId]) {
      this.messageListeners[roomId].forEach(listener => listener(message));
    }
  }

  // Start Bluetooth discovery
  startDiscovery(onUserFound: (user: ProximityReport) => void): void {
    if (this.isDiscovering) return;
    
    this.isDiscovering = true;
    console.log('Starting Bluetooth discovery...');

    // Simulate finding nearby Bluetooth devices
    this.discoveryInterval = setInterval(() => {
      // Simulate finding other users in the mesh network
      this.meshNetwork.forEach((node, nodeId) => {
        if (nodeId !== this.currentNode?.id && node.isOnline) {
          const proximityReport: ProximityReport = {
            id: `proximity-${nodeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 5)}`,
            userId: node.id,
            username: node.username,
            distance: Math.random() * 50 + 5, // 5-55 meters
            signalStrength: Math.random() * 40 + 60, // 60-100%
            timestamp: new Date(),
            roomId: node.roomId,
          };

          onUserFound(proximityReport);
        }
      });
    }, 3000 + Math.random() * 2000); // 3-5 seconds
  }

  // Stop Bluetooth discovery
  stopDiscovery(): void {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
    this.isDiscovering = false;
    console.log('Bluetooth discovery stopped');
  }

  // Create a room (become host)
  async createRoom(roomName: string, user: User): Promise<Room> {
    const room: Room = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: roomName,
      createdAt: new Date(),
      createdBy: user.id,
      memberCount: 1,
      maxMembers: 25,
      isActive: true,
      lastActivity: new Date(),
    };

    // Update current node as host
    if (this.currentNode) {
      this.currentNode.isHost = true;
      this.currentNode.roomId = room.id;
    }

    console.log(`Bluetooth room created: ${roomName} (Host: ${user.username})`);
    return room;
  }

  // Join a room via Bluetooth
  async joinRoom(roomId: string, user: User): Promise<Room> {
    // Find the host node for this room
    const hostNode = Array.from(this.meshNetwork.values()).find(
      node => node.roomId === roomId && node.isHost
    );

    if (!hostNode) {
      throw new Error('Room not found in Bluetooth network');
    }

    // Connect to host node
    if (this.currentNode) {
      this.currentNode.roomId = roomId;
      this.currentNode.connectedPeers.push(hostNode.id);
      hostNode.connectedPeers.push(this.currentNode.id);
    }

    // Create room object
    const room: Room = {
      id: roomId,
      name: `Room ${roomId}`, // In real app, this would come from host
      createdAt: new Date(),
      createdBy: hostNode.id,
      memberCount: this.getRoomMemberCount(roomId),
      maxMembers: 25,
      isActive: true,
      lastActivity: new Date(),
    };

    console.log(`${user.username} joined Bluetooth room: ${roomId}`);
    return room;
  }

  // Leave room
  async leaveRoom(roomId: string, user: User): Promise<void> {
    if (this.currentNode) {
      this.currentNode.roomId = undefined;
      this.currentNode.connectedPeers = [];
    }

    // Clear local messages for this room
    await localStorage.clearRoomMessages(roomId);
    
    console.log(`${user.username} left Bluetooth room: ${roomId}`);
  }

  // Send message via Bluetooth
  async sendMessage(roomId: string, user: User, content: string): Promise<Message> {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      roomId,
      userId: user.id,
      username: user.username,
      content,
      timestamp: new Date(),
      type: 'text',
    };

    // Store message locally first
    await localStorage.addMessageToRoom(roomId, message);

    // Broadcast message to all peers in the room
    await this.broadcastMessage(message);

    console.log(`Message broadcast via Bluetooth: ${content}`);
    return message;
  }

  // Broadcast message to all connected peers
  private async broadcastMessage(message: Message): Promise<void> {
    // Find all nodes in the same room
    const roomPeers = Array.from(this.meshNetwork.values()).filter(
      node => node.roomId === message.roomId && node.id !== this.currentNode?.id
    );

    // Simulate Bluetooth broadcast to all peers
    for (const peer of roomPeers) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // Store message in peer's local storage (simulated)
      await localStorage.addMessageToRoom(message.roomId, message);
      
      // Notify peer's message listeners
      if (this.messageListeners[message.roomId]) {
        this.messageListeners[message.roomId].forEach(listener => listener(message));
      }
    }
  }

  // Get messages from local storage (no server needed)
  async getRoomMessages(roomId: string): Promise<Message[]> {
    return await localStorage.getRoomMessages(roomId);
  }

  // Subscribe to incoming messages
  subscribeToRoom(roomId: string, onMessage: (message: Message) => void): () => void {
    if (!this.messageListeners[roomId]) {
      this.messageListeners[roomId] = [];
    }
    
    this.messageListeners[roomId].push(onMessage);
    
    return () => {
      if (this.messageListeners[roomId]) {
        this.messageListeners[roomId] = this.messageListeners[roomId].filter(
          listener => listener !== onMessage
        );
      }
    };
  }

  // Get room member count from mesh network
  private getRoomMemberCount(roomId: string): number {
    return Array.from(this.meshNetwork.values()).filter(
      node => node.roomId === roomId
    ).length;
  }

  // Get available rooms from mesh network
  async getAvailableRooms(): Promise<Room[]> {
    const rooms: Room[] = [];
    const roomHosts = new Map<string, string>();

    // Find all hosts and their rooms
    this.meshNetwork.forEach(node => {
      if (node.isHost && node.roomId) {
        roomHosts.set(node.roomId, node.id);
      }
    });

    // Create room objects
    roomHosts.forEach((hostId, roomId) => {
      const host = this.meshNetwork.get(hostId);
      if (host) {
        rooms.push({
          id: roomId,
          name: `Room ${roomId}`, // In real app, this would be stored
          createdAt: new Date(),
          createdBy: hostId,
          memberCount: this.getRoomMemberCount(roomId),
          maxMembers: 25,
          isActive: true,
          lastActivity: new Date(),
        });
      }
    });

    return rooms;
  }

  // Cleanup when app closes
  cleanup(): void {
    this.stopDiscovery();
    if (this.autoJoinInterval) {
      clearInterval(this.autoJoinInterval);
      this.autoJoinInterval = null;
    }
    this.meshNetwork.clear();
    this.messageListeners = {};
    console.log('Bluetooth service cleaned up');
  }
}

export const bluetoothService = new BluetoothService();
