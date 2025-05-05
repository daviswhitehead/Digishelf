import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '../../utils/useUser';
import Sidebar from '../../components/Sidebar';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Profile() {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const { userId } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && userId && userId !== user.userId) {
      router.push(`/${user.userId}`);
    }
  }, [loading, user, userId, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err instanceof Error ? err.message : 'Unknown error');
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

  // Format user data for display
  const formattedUserData = JSON.stringify(
    {
      uid: user.userId,
      createdAt: {
        seconds: Math.floor(user.createdAt.toDate().getTime() / 1000),
        nanoseconds: (user.createdAt.toDate().getTime() % 1000) * 1000000,
      },
      userId: user.userId,
      photoURL: user.photoURL,
      firstName: user.firstName,
      updatedAt: {
        seconds: Math.floor(user.updatedAt.toDate().getTime() / 1000),
        nanoseconds: (user.updatedAt.toDate().getTime() % 1000) * 1000000,
      },
      email: user.email,
      lastName: user.lastName,
      displayName: user.displayName,
    },
    null,
    2
  );

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Your Profile</Text>
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>{formattedUserData}</Text>
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
    flexDirection: 'row',
    backgroundColor: '#000',
    minHeight: '100vh',
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 250, // Width of sidebar
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    marginLeft: 250,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  jsonContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#000',
    whiteSpace: 'pre-wrap',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
