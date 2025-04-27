import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fee2e2', // Light red background
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626', // Red text
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#7f1d1d', // Dark red text
    lineHeight: 20,
  },
});
