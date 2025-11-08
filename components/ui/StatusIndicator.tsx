import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusIndicatorProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  showIcon?: boolean;
  style?: any;
}

export default function StatusIndicator({
  type,
  message,
  showIcon = true,
  style,
}: StatusIndicatorProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, styles[`${type}Container`], style]}>
      {showIcon && <Text style={[styles.icon, styles[`${type}Icon`]]}>{getIcon()}</Text>}
      <Text style={[styles.message, styles[`${type}Message`]]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  successContainer: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  warningContainer: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  successIcon: {
    color: '#0EA5E9',
  },
  errorIcon: {
    color: '#EF4444',
  },
  warningIcon: {
    color: '#F59E0B',
  },
  infoIcon: {
    color: '#22C55E',
  },
  message: {
    fontSize: 14,
    flex: 1,
  },
  successMessage: {
    color: '#0C4A6E',
  },
  errorMessage: {
    color: '#7F1D1D',
  },
  warningMessage: {
    color: '#92400E',
  },
  infoMessage: {
    color: '#14532D',
  },
});
