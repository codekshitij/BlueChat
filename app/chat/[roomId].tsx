import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Header, LoadingSpinner, StatusIndicator } from '../../components';
import { useAppStore } from '../../store';
import { bluetoothService } from '../../services/bluetooth.service';
import { localStorage } from '../../utils/storage';
import { Message } from '../../types';
import { validateMessage, formatMessageTime } from '../../utils/validation';

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { 
    currentUser, 
    currentRoom, 
    messages, 
    setMessages, 
    addMessage, 
    leaveRoom,
    setLoading: setStoreLoading,
    setError: setStoreError 
  } = useAppStore();

  useEffect(() => {
    // Check if user is logged in and room exists
    if (!currentUser || !roomId) {
      router.replace('/');
      return;
    }

    // Load room messages
    loadRoomMessages();
    
    // Subscribe to real-time messages via Bluetooth
    const unsubscribe = bluetoothService.subscribeToRoom(roomId, (newMessage) => {
      addMessage(newMessage);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, currentUser]);

  const loadRoomMessages = async () => {
    if (!roomId) return;
    
    try {
      setStoreLoading(true);
      
      // First try to load from local storage for faster loading
      const localMessages = await localStorage.getRoomMessages(roomId);
      
      // Load messages from local storage (Bluetooth messages are stored locally)
      const bluetoothMessages = await bluetoothService.getRoomMessages(roomId);
      
      // Use local messages as source of truth
      if (localMessages.length > 0) {
        setMessages(localMessages);
      }
      
      // Update with any new Bluetooth messages
      if (bluetoothMessages.length > localMessages.length) {
        setMessages(bluetoothMessages);
      }
      
    } catch (error) {
      console.error('Failed to load messages:', error);
      setStoreError('Failed to load messages');
    } finally {
      setStoreLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !roomId) return;

    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      setStoreError(validation.error || 'Invalid message');
      return;
    }

    setLoading(true);
    try {
      // Send message via Bluetooth
      const message = await bluetoothService.sendMessage(
        roomId, 
        currentUser, 
        newMessage.trim()
      );
      
      // Add message to store
      addMessage(message);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setStoreError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentUser || !roomId) return;
    
    setLoading(true);
    try {
      // Leave room via Bluetooth
      await bluetoothService.leaveRoom(roomId, currentUser);
      
      // Update store
      leaveRoom();
      
      // Navigate back to rooms
      router.replace('/rooms');
    } catch (error) {
      console.error('Failed to leave room:', error);
      setStoreError('Failed to leave room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.userId === currentUser?.id;
    
    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
        <View style={[styles.messageBubble, isOwnMessage && styles.ownBubble]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>{item.username}</Text>
          )}
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
            {formatMessageTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessageInput = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={currentRoom?.name || 'Chat Room'}
        showBack
        subtitle={currentRoom ? `${currentRoom.memberCount}/${currentRoom.maxMembers} members` : ''}
        rightAction={{
          title: 'Leave',
          onPress: handleLeaveRoom,
        }}
      />

      <View style={styles.content}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {renderMessageInput()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  content: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownBubble: {
    backgroundColor: '#606C38',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#606C38',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#283618',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#DDA15E',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDA15E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#283618',
    backgroundColor: '#FEFAE0',
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#606C38',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
