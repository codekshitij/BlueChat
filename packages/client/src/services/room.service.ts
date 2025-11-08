const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  isEphemeral?: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    threads: number;
    users: number;
  };
  users?: Array<{
    id: string;
    username: string;
  }>;
}

export interface Thread {
  id: string;
  title: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  threadId: string;
  userId: string;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RoomStats {
  totalRooms: number;
  activeRooms: number;
  totalUsers: number;
  onlineUsers: number;
  messagesToday: number;
  averageRoomLife: string;
}

export const roomService = {
  async getRooms(): Promise<Room[]> {
    const token = localStorage.getItem('token');
    console.log('Fetching rooms with token:', token ? 'Token exists' : 'No token');
    console.log('API URL:', `${API_URL}/rooms`);
    
    const response = await fetch(`${API_URL}/rooms`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to fetch rooms:', errorData);
      throw new Error(errorData.error || 'Failed to fetch rooms');
    }

    const data = await response.json();
    console.log('Rooms fetched:', data);
    return data;
  },

  async getRoom(roomId: string): Promise<Room> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room');
    }

    return response.json();
  },

  async createRoom(data: { name: string; description?: string; isEphemeral?: boolean; expiresAt?: Date }): Promise<Room> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    return response.json();
  },

  async getThreads(roomId: string): Promise<Thread[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/${roomId}/threads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch threads');
    }

    return response.json();
  },

  async createThread(roomId: string, data: { title: string }): Promise<Thread> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/${roomId}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create thread');
    }

    return response.json();
  },

  async getMessages(threadId: string): Promise<Message[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  async sendMessage(threadId: string, content: string): Promise<Message> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  async getStats(): Promise<RoomStats> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Return mock data if stats endpoint doesn't exist yet
      const rooms = await this.getRooms();
      return {
        totalRooms: rooms.length,
        activeRooms: rooms.filter(r => r.expiresAt && new Date(r.expiresAt) > new Date()).length,
        totalUsers: 0,
        onlineUsers: 0,
        messagesToday: 0,
        averageRoomLife: '0h',
      };
    }

    return response.json();
  },
};
