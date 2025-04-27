import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db, functions } from '../utils/firebase';
import { useUser } from '../utils/useUser';
import { httpsCallable } from 'firebase/functions';

const SidePanel = ({ isVisible, onClose, title, subtitle, scrollPosition, userId, shelfId }) => {
  const router = useRouter();
  const currentUser = useUser();
  const [userData, setUserData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user data when userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleProfileClick = () => {
    router.push(`/${userId}`);
    onClose(); // Close the panel after navigation
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('URL copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleComingSoon = () => {
    setToastMessage('Coming Soon!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNavigation = path => {
    router.push(path);
    onClose();
  };

  return (
    <View style={[styles.container, isVisible ? styles.visible : styles.hidden]}>
      {/* Header - Matching ShelfHeader style */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.iconButton}>
            <Icon name='close-outline' size={24} color='#FFFFFF' />
          </Pressable>

          {/* Title and Subtitle */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Progress Bar - Matching ShelfHeader */}
        <View style={styles.scrollBarContainer}>
          <View style={[styles.scrollBarIndicator, { width: `${scrollPosition}%` }]} />
        </View>
      </View>

      {/* Panel Content */}
      <View style={styles.content}>
        {/* User Profile - Updated */}
        <Pressable style={styles.profileSection} onPress={handleProfileClick}>
          <View style={styles.profileContainer}>
            {userData?.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name='person' size={40} color='#FFFFFF' />
              </View>
            )}
            <Text style={styles.profileName}>{userData?.displayName || 'Loading...'}</Text>
          </View>
        </Pressable>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleShare}
          >
            <Icon name='share-outline' size={24} color='#FFFFFF' />
            <Text style={styles.menuText}>Share</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleComingSoon}
          >
            <Icon name='search-outline' size={24} color='#FFFFFF' />
            <Text style={styles.menuText}>Search</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleComingSoon}
          >
            <Icon name='filter-outline' size={24} color='#FFFFFF' />
            <Text style={styles.menuText}>Filter</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleComingSoon}
          >
            <Icon name='swap-vertical-outline' size={24} color='#FFFFFF' />
            <Text style={styles.menuText}>Sort</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              isRefreshing && styles.menuItemDisabled,
            ]}
            onPress={async () => {
              console.log('Debug - shelfId:', shelfId); // Debug log

              if (!shelfId) {
                setToastMessage('No shelf ID available. Please try again.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
              }

              if (!currentUser) {
                setToastMessage('Please log in to refresh the shelf.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
              }

              setIsRefreshing(true);
              try {
                console.log('Debug - Making refresh call with:', { shelfId, auth: currentUser }); // Debug log
                const refreshShelf = httpsCallable(functions, 'refreshShelf');
                const result = await refreshShelf({
                  shelfId: shelfId,
                  auth: currentUser,
                });
                console.log('Debug - Refresh result:', result); // Log the result
                setToastMessage('Shelf refreshed successfully!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                // Optionally reload the page to show new data
                router.reload();
              } catch (error) {
                console.error('Failed to refresh shelf:', error);
                const errorMessage = error.message?.includes('unauthenticated')
                  ? 'Please log in to refresh the shelf.'
                  : 'Failed to refresh shelf. Please try again.';
                setToastMessage(errorMessage);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              } finally {
                setIsRefreshing(false);
              }
            }}
            disabled={isRefreshing || !shelfId || !currentUser}
          >
            <Icon name='refresh-outline' size={24} color={currentUser ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.menuText, !currentUser && styles.menuTextDisabled]}>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleComingSoon}
          >
            <Icon name='settings-outline' size={24} color='#FFFFFF' />
            <Text style={styles.menuText}>Settings</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom Navigation Section */}
      <View style={styles.bottomSection}>
        {/* Current User Profile */}
        <Pressable
          style={styles.currentUserProfile}
          onPress={() => handleNavigation(`/${currentUser?.uid}`)}
        >
          <View style={styles.profileContainer}>
            {currentUser?.photoURL ? (
              <Image source={{ uri: currentUser.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name='person' size={40} color='#FFFFFF' />
              </View>
            )}
            <Text style={styles.profileName}>{currentUser?.displayName || 'Loading...'}</Text>
          </View>
        </Pressable>

        {/* Navigation Links */}
        <Pressable
          style={({ pressed }) => [styles.navItem, pressed && styles.menuItemPressed]}
          onPress={() => handleNavigation(`/${currentUser?.uid}/shelves`)}
        >
          <Icon name='book-outline' size={24} color='#FFFFFF' />
          <Text style={styles.menuText}>Shelves</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navItem, pressed && styles.menuItemPressed]}
          onPress={() => handleNavigation(`/${currentUser?.uid}/integrations`)}
        >
          <Icon name='link-outline' size={24} color='#FFFFFF' />
          <Text style={styles.menuText}>Integrations</Text>
        </Pressable>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: 350,
    backgroundColor: '#1C1C1C',
    zIndex: 2000,
    transform: [{ translateX: -350 }],
    transition: 'transform 0.3s ease-in-out',
  },
  visible: {
    transform: [{ translateX: 0 }],
  },
  hidden: {
    transform: [{ translateX: -350 }],
  },
  header: {
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 0,
  },
  subtitle: {
    color: 'gray',
    fontSize: 20,
    marginLeft: 4,
    flexShrink: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBarContainer: {
    height: 4,
    backgroundColor: 'white',
  },
  scrollBarIndicator: {
    height: '100%',
    backgroundColor: '#EAB308',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#2C2C2C',
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  menuItemPressed: {
    opacity: 0.6,
  },
  toast: {
    position: 'fixed',
    bottom: 20,
    left: '50vw',
    transform: [{ translateX: '-50%' }],
    backgroundColor: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    zIndex: 2100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    animation: 'slideUp 0.3s ease-out',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  '@keyframes slideUp': {
    from: {
      transform: [{ translateX: '-50%' }, { translateY: '100%' }],
      opacity: 0,
    },
    to: {
      transform: [{ translateX: '-50%' }, { translateY: '0%' }],
      opacity: 1,
    },
  },
  bottomSection: {
    marginTop: 'auto', // Push to bottom
    width: '100%',
    paddingBottom: 16, // Add some padding at the bottom
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  currentUserProfile: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8, // Add some space between profile and nav items
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuTextDisabled: {
    color: '#666666',
  },
});

export default SidePanel;
