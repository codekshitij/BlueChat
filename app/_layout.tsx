import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#FEFAE0" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FEFAE0' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="rooms" />
        <Stack.Screen name="chat/[roomId]" />
      </Stack>
    </>
  );
}
