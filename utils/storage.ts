import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Room, Message, ProximityReport } from '../types';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'bluechat_current_user',
  NEARBY_USERS: 'bluechat_nearby_users',
  ROOM_MESSAGES: 'bluechat_room_messages_',
  AVAILABLE_ROOMS: 'bluechat_available_rooms',
  APP_SETTINGS: 'bluechat_app_settings',
} as const;

// Local storage utility class
class LocalStorage {
  // User management
  async saveCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error('Failed to save current user:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (userData) {
        const user = JSON.parse(userData);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        user.lastSeen = new Date(user.lastSeen);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  // Nearby users management
  async saveNearbyUsers(users: ProximityReport[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NEARBY_USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save nearby users:', error);
    }
  }

  async getNearbyUsers(): Promise<ProximityReport[]> {
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.NEARBY_USERS);
      if (usersData) {
        const users = JSON.parse(usersData);
        // Convert date strings back to Date objects
        return users.map((user: any) => ({
          ...user,
          timestamp: new Date(user.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get nearby users:', error);
      return [];
    }
  }

  // Room messages management
  async saveRoomMessages(roomId: string, messages: Message[]): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.ROOM_MESSAGES}${roomId}`;
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save room messages:', error);
    }
  }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    try {
      const key = `${STORAGE_KEYS.ROOM_MESSAGES}${roomId}`;
      const messagesData = await AsyncStorage.getItem(key);
      if (messagesData) {
        const messages = JSON.parse(messagesData);
        // Convert date strings back to Date objects
        return messages.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get room messages:', error);
      return [];
    }
  }

  async addMessageToRoom(roomId: string, message: Message): Promise<void> {
    try {
      const existingMessages = await this.getRoomMessages(roomId);
      const updatedMessages = [...existingMessages, message];
      await this.saveRoomMessages(roomId, updatedMessages);
    } catch (error) {
      console.error('Failed to add message to room:', error);
    }
  }

  async clearRoomMessages(roomId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.ROOM_MESSAGES}${roomId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear room messages:', error);
    }
  }

  // Available rooms management
  async saveAvailableRooms(rooms: Room[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AVAILABLE_ROOMS, JSON.stringify(rooms));
    } catch (error) {
      console.error('Failed to save available rooms:', error);
    }
  }

  async getAvailableRooms(): Promise<Room[]> {
    try {
      const roomsData = await AsyncStorage.getItem(STORAGE_KEYS.AVAILABLE_ROOMS);
      if (roomsData) {
        const rooms = JSON.parse(roomsData);
        // Convert date strings back to Date objects
        return rooms.map((room: any) => ({
          ...room,
          createdAt: new Date(room.createdAt),
          lastActivity: new Date(room.lastActivity),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get available rooms:', error);
      return [];
    }
  }

  // App settings management
  async saveAppSettings(settings: {
    username?: string;
    lastActive?: Date;
    preferences?: any;
  }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
  }

  async getAppSettings(): Promise<{
    username?: string;
    lastActive?: Date;
    preferences?: any;
  }> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        if (settings.lastActive) {
          settings.lastActive = new Date(settings.lastActive);
        }
        return settings;
      }
      return {};
    } catch (error) {
      console.error('Failed to get app settings:', error);
      return {};
    }
  }

  // Clear all data (for privacy/reset)
  async clearAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('bluechat_'));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  // Clear expired data (older than 24 hours)
  async clearExpiredData(): Promise<void> {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Clear old nearby users
      const nearbyUsers = await this.getNearbyUsers();
      const recentUsers = nearbyUsers.filter(user => 
        user.timestamp > oneDayAgo
      );
      await this.saveNearbyUsers(recentUsers);

      // Clear old room messages (keep only last 100 messages per room)
      const roomKeys = await AsyncStorage.getAllKeys();
      const messageKeys = roomKeys.filter(key => 
        key.startsWith(STORAGE_KEYS.ROOM_MESSAGES)
      );

      for (const key of messageKeys) {
        const messages = await this.getRoomMessages(key.replace(STORAGE_KEYS.ROOM_MESSAGES, ''));
        if (messages.length > 100) {
          const recentMessages = messages.slice(-100);
          await this.saveRoomMessages(key.replace(STORAGE_KEYS.ROOM_MESSAGES, ''), recentMessages);
        }
      }
    } catch (error) {
      console.error('Failed to clear expired data:', error);
    }
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{
    totalSize: number;
    messageCount: number;
    roomCount: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('bluechat_'));
      
      let totalSize = 0;
      let messageCount = 0;
      let roomCount = 0;

      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          
          if (key.startsWith(STORAGE_KEYS.ROOM_MESSAGES)) {
            const messages = JSON.parse(value);
            messageCount += messages.length;
            roomCount++;
          }
        }
      }

      return { totalSize, messageCount, roomCount };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalSize: 0, messageCount: 0, roomCount: 0 };
    }
  }
}

export const localStorage = new LocalStorage();
