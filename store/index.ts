import { create } from 'zustand';
import { User, Room, Message, ProximityReport, AppState } from '../types';
import { localStorage } from '../utils/storage';

interface AppStore extends AppState {
  // User actions
  setCurrentUser: (user: User | null) => void;
  updateUserStatus: (isOnline: boolean) => void;
  
  // Room actions
  setCurrentRoom: (room: Room | null) => void;
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
  
  // Message actions
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  
  // Proximity actions
  setNearbyUsers: (users: ProximityReport[]) => void;
  addNearbyUser: (user: ProximityReport) => void;
  removeNearbyUser: (userId: string) => void;
  updateNearbyUser: (userId: string, updates: Partial<ProximityReport>) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  reset: () => void;
}

const initialState: AppState = {
  currentUser: null,
  nearbyUsers: [],
  currentRoom: null,
  messages: [],
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  // User actions
  setCurrentUser: async (user) => {
    set({ currentUser: user });
    await localStorage.saveCurrentUser(user);
  },
  
  updateUserStatus: async (isOnline) => {
    const { currentUser } = get();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        isOnline,
        lastSeen: new Date(),
      };
      set({ currentUser: updatedUser });
      await localStorage.saveCurrentUser(updatedUser);
    }
  },

  // Room actions
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  joinRoom: (room) => {
    set({ currentRoom: room });
    const { currentUser } = get();
    if (currentUser) {
      set({
        currentUser: {
          ...currentUser,
          currentRoomId: room.id,
        },
      });
    }
  },
  
  leaveRoom: () => {
    set({ currentRoom: null, messages: [] });
    const { currentUser } = get();
    if (currentUser) {
      set({
        currentUser: {
          ...currentUser,
          currentRoomId: undefined,
        },
      });
    }
  },

  // Message actions
  addMessage: async (message) => {
    const { messages, currentRoom } = get();
    const updatedMessages = [...messages, message];
    set({ messages: updatedMessages });
    
    // Save to local storage for persistence
    if (currentRoom) {
      await localStorage.saveRoomMessages(currentRoom.id, updatedMessages);
    }
  },
  
  setMessages: async (messages) => {
    set({ messages });
    
    // Save to local storage for persistence
    const { currentRoom } = get();
    if (currentRoom) {
      await localStorage.saveRoomMessages(currentRoom.id, messages);
    }
  },
  
  clearMessages: async () => {
    set({ messages: [] });
    
    // Clear from local storage
    const { currentRoom } = get();
    if (currentRoom) {
      await localStorage.clearRoomMessages(currentRoom.id);
    }
  },

  // Proximity actions
  setNearbyUsers: async (users) => {
    set({ nearbyUsers: users });
    await localStorage.saveNearbyUsers(users);
  },
  
  addNearbyUser: async (user) => {
    const { nearbyUsers } = get();
    const existingIndex = nearbyUsers.findIndex(u => u.userId === user.userId);
    
    let updatedUsers;
    if (existingIndex >= 0) {
      // Update existing user
      updatedUsers = [...nearbyUsers];
      updatedUsers[existingIndex] = user;
    } else {
      // Add new user
      updatedUsers = [...nearbyUsers, user];
    }
    
    set({ nearbyUsers: updatedUsers });
    await localStorage.saveNearbyUsers(updatedUsers);
  },
  
  removeNearbyUser: (userId) => {
    const { nearbyUsers } = get();
    set({
      nearbyUsers: nearbyUsers.filter(user => user.userId !== userId),
    });
  },
  
  updateNearbyUser: (userId, updates) => {
    const { nearbyUsers } = get();
    set({
      nearbyUsers: nearbyUsers.map(user =>
        user.userId === userId ? { ...user, ...updates } : user
      ),
    });
  },

  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Utility actions
  reset: async () => {
    set(initialState);
    await localStorage.clearAllData();
  },
  
  // Initialize store from local storage
  initializeFromStorage: async () => {
    try {
      const [user, nearbyUsers] = await Promise.all([
        localStorage.getCurrentUser(),
        localStorage.getNearbyUsers(),
      ]);
      
      set({
        currentUser: user,
        nearbyUsers,
      });
    } catch (error) {
      console.error('Failed to initialize from storage:', error);
    }
  },
}));
