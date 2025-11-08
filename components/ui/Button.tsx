// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : '#606C38'} 
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#606C38',
  },
  secondaryButton: {
    backgroundColor: '#FEFAE0',
    borderWidth: 1,
    borderColor: '#DDA15E',
  },
  dangerButton: {
    backgroundColor: '#BC6C25',
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mediumButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  
  // Disabled state
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
  },
  
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#283618',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabledText: {
    color: '#FFFFFF',
  },
});