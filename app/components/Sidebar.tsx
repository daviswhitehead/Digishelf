import React from 'react';
import { useRouter } from 'next/router';
import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from './primitives';

const Sidebar = () => {
  const router = useRouter();
  const { userId } = router.query;

  const links = [
    { name: 'Profile', path: `/${userId}` },
    { name: 'Integrations', path: `/${userId}/integrations` },
    { name: 'Shelves', path: `/${userId}/shelves` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digishelf</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.linkContainer}>
          {links.map(link => (
            <Pressable
              key={link.name}
              onPress={() => router.push(link.path)}
              style={[styles.link, router.pathname === link.path && styles.activeLink]}
            >
              <Text
                style={[styles.linkText, router.pathname === link.path && styles.activeLinkText]}
              >
                {link.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 10,
  },
  link: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 16,
    color: '#fff',
  },
  activeLink: {
    // No additional styles for the active link container
  },
  activeLinkText: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
});

export default Sidebar;
