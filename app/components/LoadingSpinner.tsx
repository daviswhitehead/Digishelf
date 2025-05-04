import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native-web';

export const LoadingSpinner: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#2563eb' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Ensure spinner has enough vertical space
  },
});
