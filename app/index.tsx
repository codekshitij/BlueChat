import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { AppLogo, Input, Button, PrivacyNotice } from '../components';
import { useAppStore } from '../store';
import { bluetoothService } from '../services/bluetooth.service';
import { validateUsername } from '../utils/validation';

export default function UsernameEntryScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { 
    currentUser, 
    setCurrentUser, 
    setLoading: setStoreLoading, 
    setError: setStoreError,
    initializeFromStorage 
  } = useAppStore();

  // Initialize from storage on mount
  useEffect(() => {
    initializeFromStorage();
  }, []);

  // If user is already logged in, redirect to rooms
  useEffect(() => {
    if (currentUser) {
      router.replace('/rooms');
    }
  }, [currentUser]);

  const handleContinue = async () => {
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user object
      const user = { 
        id: `user-${Date.now()}`,
        username,
        createdAt: new Date(),
        lastSeen: new Date(),
        isOnline: true,
      };
      
      // Initialize Bluetooth node
      await bluetoothService.initializeNode(user);
      
      // Store user in Zustand store
      setCurrentUser(user);
      
      // Navigate to rooms screen
      router.push('/rooms');
    } catch (err) {
      const errorMessage = 'Failed to create user. Please try again.';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (error) {
      setError('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <AppLogo size="large" />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Input
              label="Choose a username"
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="Enter your username"
              maxLength={20}
              error={error}
            />

            {/* Privacy Notice */}
            <PrivacyNotice type="info" showIcon={true} />

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!username.trim()}
              style={styles.continueButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Connect with people nearby through Bluetooth discovery
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  continueButton: {
    marginTop: 24,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#606C38',
    textAlign: 'center',
    lineHeight: 20,
  },
});
