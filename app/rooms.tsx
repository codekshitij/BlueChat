import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Header, LoadingSpinner, StatusIndicator, RoomCard, NearbyUserCard } from '../components';
import { useAppStore } from '../store';
import { bluetoothService } from '../services/bluetooth.service';
import { ProximityReport, Room } from '../types';
import { formatDistance } from '../utils/validation';

export default function RoomsScreen() {
  const [scanning, setScanning] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [seenProximityIds] = useState(new Set<string>());
  
  const { 
    currentUser, 
    nearbyUsers, 
    setNearbyUsers, 
    addNearbyUser, 
    joinRoom, 
    setLoading: setStoreLoading,
    setError: setStoreError 
  } = useAppStore();

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.replace('/');
      return;
    }

    // Load available rooms
    loadRooms();
    
    // Start proximity discovery
    startProximityDiscovery();
    
    // Stop scanning after 3 seconds
    const scanTimer = setTimeout(() => {
      setScanning(false);
    }, 3000);

    // Refresh room list every 10 seconds to show new rooms
    const roomRefreshInterval = setInterval(() => {
      loadRooms();
    }, 10000);

    // Clear nearby users every 30 seconds to prevent list from growing too large
    const userCleanupInterval = setInterval(() => {
      setNearbyUsers([]);
      seenProximityIds.clear();
    }, 30000);

    return () => {
      clearTimeout(scanTimer);
      clearInterval(roomRefreshInterval);
      clearInterval(userCleanupInterval);
      bluetoothService.stopDiscovery();
      seenProximityIds.clear();
    };
  }, [currentUser]);

  const loadRooms = async () => {
    try {
      setStoreLoading(true);
      const availableRooms = await bluetoothService.getAvailableRooms();
      setRooms(availableRooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setStoreError('Failed to load rooms');
    } finally {
      setStoreLoading(false);
    }
  };

  const startProximityDiscovery = () => {
    bluetoothService.startDiscovery((proximityReport) => {
      // Create a unique key for this proximity report
      const uniqueKey = `${proximityReport.userId}-${proximityReport.timestamp.getTime()}`;
      
      // Only add if we haven't seen this exact proximity report before
      if (!seenProximityIds.has(uniqueKey)) {
        seenProximityIds.add(uniqueKey);
        
        // Also check if we already have this user in the list
        const existingUser = nearbyUsers.find(user => user.userId === proximityReport.userId);
        if (!existingUser) {
          addNearbyUser(proximityReport);
        }
      }
    });
  };

  const handleJoinRoom = async (room: Room) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Join room via Bluetooth
      const updatedRoom = await bluetoothService.joinRoom(room.id, currentUser);
      
      // Update store
      joinRoom(updatedRoom);
      
      // Navigate to chat
      router.push(`/chat/${room.id}`);
    } catch (error) {
      console.error('Failed to join room:', error);
      setStoreError('Failed to join room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderNearbyUser = ({ item }: { item: ProximityReport }) => (
    <NearbyUserCard user={item} />
  );

  const renderRoom = ({ item }: { item: Room }) => (
    <RoomCard 
      room={item} 
      onJoin={handleJoinRoom}
      loading={loading}
    />
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Joining room..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Nearby Rooms" 
        showBack 
        subtitle="Find people and join chat rooms"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scanning Status */}
        {scanning && (
          <StatusIndicator
            type="info"
            message="Scanning for nearby users..."
            showIcon={true}
          />
        )}

        {/* Nearby Users Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Users ({nearbyUsers.length})</Text>
          <FlatList
            data={nearbyUsers.slice(0, 10)} // Limit to 10 users
            renderItem={renderNearbyUser}
            keyExtractor={(item) => `${item.userId}-${item.timestamp.getTime()}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.usersList}
          />
        </View>

        {/* Available Rooms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rooms</Text>
          <FlatList
            data={rooms}
            renderItem={renderRoom}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
    marginBottom: 12,
  },
  usersList: {
    paddingRight: 16,
  },
});
