import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  maxLength,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multilineInput,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDA15E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#283618',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#BC6C25',
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#BC6C25',
    marginTop: 4,
    marginLeft: 4,
  },
});
