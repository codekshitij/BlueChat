import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusIndicator from './StatusIndicator';

interface PrivacyNoticeProps {
  type?: 'info' | 'warning';
  showIcon?: boolean;
}

export default function PrivacyNotice({ type = 'info', showIcon = true }: PrivacyNoticeProps) {
  return (
    <View style={styles.container}>
      <StatusIndicator
        type={type}
        message="Messages are sent directly via Bluetooth to nearby users. All data is stored locally and automatically cleared when you leave the chat."
        showIcon={showIcon}
      />
      
      <View style={styles.details}>
        <Text style={styles.detailText}>
          • Messages sent directly via Bluetooth to nearby users
        </Text>
        <Text style={styles.detailText}>
          • No internet connection or external servers required
        </Text>
        <Text style={styles.detailText}>
          • All data stored locally on your device
        </Text>
        <Text style={styles.detailText}>
          • Messages automatically cleared when leaving chat
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  details: {
    marginTop: 12,
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#606C38',
    marginBottom: 4,
    lineHeight: 16,
  },
});
