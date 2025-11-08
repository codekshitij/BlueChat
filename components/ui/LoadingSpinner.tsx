import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  color?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  text,
  fullScreen = false,
  color = '#606C38',
}: LoadingSpinnerProps) {
  const spinnerSize = {
    small: 'small',
    medium: 'large',
    large: 'large',
  }[size];

  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;
  const textStyle = fullScreen ? styles.fullScreenText : styles.text;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={spinnerSize} color={color} />
      {text && <Text style={textStyle}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(254, 250, 224, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#283618',
    textAlign: 'center',
  },
  fullScreenText: {
    marginTop: 16,
    fontSize: 18,
    color: '#283618',
    textAlign: 'center',
    fontWeight: '600',
  },
});
