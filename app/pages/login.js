import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthPage from '../components/Login';

export default function Login() {
  return (
    <View style={styles.container}>
      <AuthPage />
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
