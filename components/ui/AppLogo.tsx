import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  style?: any;
}

export default function AppLogo({
  size = 'medium',
  showTagline = true,
  style,
}: AppLogoProps) {
  const sizeStyles = {
    small: {
      logoSize: 24,
      titleSize: 18,
      taglineSize: 12,
    },
    medium: {
      logoSize: 32,
      titleSize: 24,
      taglineSize: 14,
    },
    large: {
      logoSize: 48,
      titleSize: 32,
      taglineSize: 16,
    },
  };

  const { logoSize, titleSize, taglineSize } = sizeStyles[size];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize }]}>
        <Text style={[styles.logoText, { fontSize: logoSize * 0.6 }]}>🔵</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { fontSize: titleSize }]}>BlueChat</Text>
        {showTagline && (
          <Text style={[styles.tagline, { fontSize: taglineSize }]}>
            Connect nearby, chat ephemerally
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#283618',
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    color: '#606C38',
    textAlign: 'center',
    fontWeight: '500',
  },
});
