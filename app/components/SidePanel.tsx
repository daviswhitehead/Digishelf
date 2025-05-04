import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native-web';
import { getAuth, signOut } from 'firebase/auth';
import { useUser } from '../utils/useUser';

export interface Props {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  userId: string;
  shelfId: string;
}

export const SidePanel: React.FC<Props> = ({
  isVisible,
  onClose,
  title,
  subtitle,
  userId,
  shelfId,
}) => {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const slideAnim = React.useRef(new Animated.Value(isVisible ? 0 : 300)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  const _handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/login');
      onClose();
    } catch (error) {
      setToastMessage('Failed to log out. Please try again.');
      setShowToast(true);
    }
  };

  const handleEditShelf = () => {
    router.push(`/${userId}/shelves/${shelfId}/edit`);
  };

  const handleDeleteShelf = () => {
    // Implement delete functionality
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {isVisible && (
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.overlayBackground} />
        </Pressable>
      )}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.content}>
          {loading && <Text>Loading...</Text>}
          {error && <Text style={styles.error}>{error.message}</Text>}
          {!loading && !error && user && (
            <View>
              <Text>User: {user.displayName}</Text>
              {/* Add more panel content here */}
            </View>
          )}
          <Pressable style={styles.button} onPress={handleEditShelf}>
            <Text style={styles.buttonText}>Edit Shelf</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDeleteShelf}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Shelf</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.logoutButton]} onPress={_handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
          </Pressable>
        </View>
        {showToast && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    zIndex: 101,
    padding: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
  error: {
    color: 'red',
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f3f4f6',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#4b5563',
  },
});

export default SidePanel;
