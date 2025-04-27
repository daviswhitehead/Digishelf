import React from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/clientApp';
import { signOut, Auth } from 'firebase/auth';
import { useUser } from '../../hooks/useUser';
import Sidebar from '../../components/Sidebar';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Profile() {
  const router = useRouter();
  const { user, loading, error } = useUser();

  const handleLogout = async () => {
    if (!auth) {
      console.error('Auth is not initialized');
      return;
    }

    try {
      await signOut(auth as Auth);
      router.push('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during logout';
      console.error('Logout error:', errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
          <Text style={styles.errorText}>{error.message || 'An error occurred'}</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
          <Text style={styles.errorText}>Please sign in to view your profile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Your Profile</Text>
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>{JSON.stringify(user, null, 2)}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Align sidebar and content side by side
    backgroundColor: '#000',
  },
  contentWrapper: {
    flex: 1, // Allow the content to take up the remaining space
    marginLeft: 250, // Match the width of the sidebar
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  jsonContainer: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  jsonText: {
    color: '#000',
    fontFamily: 'monospace',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
