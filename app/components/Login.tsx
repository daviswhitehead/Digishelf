import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError('Authentication is not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();

      // In development, we want to use a test account
      if (process.env.NODE_ENV === 'development') {
        // This helps with emulator debugging
        console.log('🔑 Attempting Google sign-in with emulator');
        provider.setCustomParameters({
          prompt: 'select_account',
        });
      }

      const result = await signInWithPopup(auth as Auth, provider);
      const user = result.user;
      console.log('✅ Successfully logged in:', user.email);

      // The UserProvider will handle creating/updating the user document in Firestore
      router.push(`/${user.uid}`);
    } catch (err) {
      console.error('❌ Login error:', err);

      // More descriptive error messages
      let errorMessage = 'An error occurred during login';
      if (err instanceof Error) {
        if (err.message.includes('auth/popup-closed-by-user')) {
          errorMessage = 'Login was cancelled';
        } else if (err.message.includes('auth/network-request-failed')) {
          errorMessage = 'Network error - please check your connection';
        } else if (err.message.includes('auth/popup-blocked')) {
          errorMessage = 'Login popup was blocked - please allow popups for this site';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DigiShelf</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in with Google'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    minWidth: 300,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4285f4',
    padding: 15,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Login;
