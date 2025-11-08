import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    title: string;
    onPress: () => void;
  };
  subtitle?: string;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightAction,
  subtitle,
}: HeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightAction && (
        <TouchableOpacity style={styles.rightButton} onPress={rightAction.onPress}>
          <Text style={styles.rightButtonText}>{rightAction.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEFAE0',
    borderBottomWidth: 1,
    borderBottomColor: '#DDA15E',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 24,
    color: '#606C38',
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#283618',
  },
  subtitle: {
    fontSize: 14,
    color: '#606C38',
    marginTop: 2,
  },
  rightButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#606C38',
  },
  rightButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
