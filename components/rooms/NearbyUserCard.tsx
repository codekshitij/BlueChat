import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProximityReport } from '../../types';
import { formatDistance, formatSignalStrength } from '../../utils/validation';

interface NearbyUserCardProps {
  user: ProximityReport;
}

export default function NearbyUserCard({ user }: NearbyUserCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.distance}>{formatDistance(user.distance)} away</Text>
        <Text style={styles.signal}>
          Signal: {formatSignalStrength(user.signalStrength)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: '#606C38',
    marginBottom: 2,
  },
  signal: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});
