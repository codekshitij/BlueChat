import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Room } from '../../types';
import { Alert, Clipboard } from 'react-native';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
  loading?: boolean;
}

export default function RoomCard({ room, onJoin, loading = false }: RoomCardProps) {
  const isFull = room.memberCount >= room.maxMembers;

  // Handler to generate and copy invite link
  const handleInvite = async () => {
    try {
      // You may need to update the API URL depending on your fetch setup
      const res = await fetch(`/api/rooms/${room.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const link = `${window.location.origin}/join/${data.token}`;
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(link);
          Alert.alert('Invite Link Copied', 'Share this link: ' + link);
        } else {
          Clipboard.setString(link);
          Alert.alert('Invite Link', 'Share this link: ' + link);
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to create invite');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create invite');
    }
  };

  return (
    <View style={[styles.container, isFull && styles.fullRoom]}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomCapacity}>
          {room.memberCount}/{room.maxMembers} members
        </Text>
      </View>
      <View style={styles.roomActions}>
        {isFull ? (
          <Text style={styles.fullText}>Full</Text>
        ) : (
          <TouchableOpacity
            style={[styles.joinButton, loading && styles.joinButtonDisabled]}
            onPress={() => onJoin(room)}
            disabled={loading}
          >
            <Text style={styles.joinButtonText}>
              {loading ? 'Joining...' : 'Join'}
            </Text>
          </TouchableOpacity>
        )}
        {/* Invite button for members (not full) */}
        {!isFull && (
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: '#6C63FF', marginLeft: 8 }]}
            onPress={handleInvite}
          >
            <Text style={styles.joinButtonText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullRoom: {
    opacity: 0.6,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 4,
  },
  roomCapacity: {
    fontSize: 14,
    color: '#606C38',
  },
  roomActions: {
    alignItems: 'center',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#DDA15E',
    borderRadius: 8,
  },
  joinButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BC6C25',
  },
});
