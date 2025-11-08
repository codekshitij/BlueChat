import { ValidationResult } from '../types';

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 2) {
    return { isValid: false, error: 'Username must be at least 2 characters' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be 20 characters or less' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

// Room name validation
export const validateRoomName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Room name is required' };
  }
  
  if (name.length < 3) {
    return { isValid: false, error: 'Room name must be at least 3 characters' };
  }
  
  if (name.length > 30) {
    return { isValid: false, error: 'Room name must be 30 characters or less' };
  }
  
  return { isValid: true };
};

// Message validation
export const validateMessage = (content: string): ValidationResult => {
  if (!content.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 500) {
    return { isValid: false, error: 'Message must be 500 characters or less' };
  }
  
  return { isValid: true };
};

// Distance formatting
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return '< 1m';
  }
  
  if (distance < 10) {
    return `${Math.round(distance)}m`;
  }
  
  if (distance < 100) {
    return `${Math.round(distance / 10) * 10}m`;
  }
  
  return `${Math.round(distance / 100) * 100}m`;
};

// Signal strength formatting
export const formatSignalStrength = (strength: number): string => {
  if (strength >= 80) return 'Excellent';
  if (strength >= 60) return 'Good';
  if (strength >= 40) return 'Fair';
  return 'Poor';
};

// Time formatting
export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

// Relative time for messages
export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleDateString();
};
