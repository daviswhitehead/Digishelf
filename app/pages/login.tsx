import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Login } from '../components/Login';

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
