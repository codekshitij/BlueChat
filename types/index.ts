// Core data types for BlueChat

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  lastSeen: Date;
  isOnline: boolean;
  currentRoomId?: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  memberCount: number;
  maxMembers: number;
  isActive: boolean;
  lastActivity: Date;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface ProximityReport {
  id: string;
  userId: string;
  username: string;
  distance: number; // Simulated distance in meters
  signalStrength: number; // Simulated signal strength (0-100)
  timestamp: Date;
  roomId?: string;
}

export interface AppState {
  currentUser: User | null;
  nearbyUsers: ProximityReport[];
  currentRoom: Room | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Navigation and UI types
export interface NavigationState {
  currentScreen: string;
  previousScreen?: string;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
