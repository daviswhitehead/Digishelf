"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Ionicons_1 = __importDefault(require("react-native-vector-icons/Ionicons"));
const router_1 = require("next/router");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../utils/firebase");
const useUser_1 = require("../utils/useUser");
const functions_1 = require("firebase/functions");
const SidePanel = ({ isVisible, onClose, title, subtitle, scrollPosition, userId, shelfId }) => {
    const router = (0, router_1.useRouter)();
    const currentUser = (0, useUser_1.useUser)();
    const [userData, setUserData] = (0, react_1.useState)(null);
    const [showToast, setShowToast] = (0, react_1.useState)(false);
    const [toastMessage, setToastMessage] = (0, react_1.useState)('');
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    // Fetch user data when userId changes
    (0, react_1.useEffect)(() => {
        const fetchUserData = async () => {
            if (!userId)
                return;
            try {
                const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
            catch (error) {
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
        }
        catch (err) {
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
    return (<react_native_1.View style={[styles.container, isVisible ? styles.visible : styles.hidden]}>
      {/* Header - Matching ShelfHeader style */}
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.headerContent}>
          {/* Close Button */}
          <react_native_1.Pressable onPress={onClose} style={styles.iconButton}>
            <Ionicons_1.default name='close-outline' size={24} color='#FFFFFF'/>
          </react_native_1.Pressable>

          {/* Title and Subtitle */}
          <react_native_1.View style={styles.textContainer}>
            <react_native_1.Text style={styles.title}>{title}</react_native_1.Text>
            <react_native_1.Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>
              {subtitle}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Progress Bar - Matching ShelfHeader */}
        <react_native_1.View style={styles.scrollBarContainer}>
          <react_native_1.View style={[styles.scrollBarIndicator, { width: `${scrollPosition}%` }]}/>
        </react_native_1.View>
      </react_native_1.View>

      {/* Panel Content */}
      <react_native_1.View style={styles.content}>
        {/* User Profile - Updated */}
        <react_native_1.Pressable style={styles.profileSection} onPress={handleProfileClick}>
          <react_native_1.View style={styles.profileContainer}>
            {(userData === null || userData === void 0 ? void 0 : userData.photoURL) ? (<react_native_1.Image source={{ uri: userData.photoURL }} style={styles.profileImage}/>) : (<react_native_1.View style={styles.profileImagePlaceholder}>
                <Ionicons_1.default name='person' size={40} color='#FFFFFF'/>
              </react_native_1.View>)}
            <react_native_1.Text style={styles.profileName}>{(userData === null || userData === void 0 ? void 0 : userData.displayName) || 'Loading...'}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Pressable>

        {/* Menu Items */}
        <react_native_1.View style={styles.menuSection}>
          <react_native_1.Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={handleShare}>
            <Ionicons_1.default name='share-outline' size={24} color='#FFFFFF'/>
            <react_native_1.Text style={styles.menuText}>Share</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={handleComingSoon}>
            <Ionicons_1.default name='search-outline' size={24} color='#FFFFFF'/>
            <react_native_1.Text style={styles.menuText}>Search</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={handleComingSoon}>
            <Ionicons_1.default name='filter-outline' size={24} color='#FFFFFF'/>
            <react_native_1.Text style={styles.menuText}>Filter</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={handleComingSoon}>
            <Ionicons_1.default name='swap-vertical-outline' size={24} color='#FFFFFF'/>
            <react_native_1.Text style={styles.menuText}>Sort</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
            isRefreshing && styles.menuItemDisabled,
        ]} onPress={async () => {
            var _a;
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
                const refreshShelf = (0, functions_1.httpsCallable)(firebase_1.functions, 'refreshShelf');
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
            }
            catch (error) {
                console.error('Failed to refresh shelf:', error);
                const errorMessage = ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('unauthenticated'))
                    ? 'Please log in to refresh the shelf.'
                    : 'Failed to refresh shelf. Please try again.';
                setToastMessage(errorMessage);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
            finally {
                setIsRefreshing(false);
            }
        }} disabled={isRefreshing || !shelfId || !currentUser}>
            <Ionicons_1.default name='refresh-outline' size={24} color={currentUser ? '#FFFFFF' : '#666666'}/>
            <react_native_1.Text style={[styles.menuText, !currentUser && styles.menuTextDisabled]}>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={handleComingSoon}>
            <Ionicons_1.default name='settings-outline' size={24} color='#FFFFFF'/>
            <react_native_1.Text style={styles.menuText}>Settings</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>

      {/* Bottom Navigation Section */}
      <react_native_1.View style={styles.bottomSection}>
        {/* Current User Profile */}
        <react_native_1.Pressable style={styles.currentUserProfile} onPress={() => handleNavigation(`/${currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid}`)}>
          <react_native_1.View style={styles.profileContainer}>
            {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.photoURL) ? (<react_native_1.Image source={{ uri: currentUser.photoURL }} style={styles.profileImage}/>) : (<react_native_1.View style={styles.profileImagePlaceholder}>
                <Ionicons_1.default name='person' size={40} color='#FFFFFF'/>
              </react_native_1.View>)}
            <react_native_1.Text style={styles.profileName}>{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.displayName) || 'Loading...'}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Pressable>

        {/* Navigation Links */}
        <react_native_1.Pressable style={({ pressed }) => [styles.navItem, pressed && styles.menuItemPressed]} onPress={() => handleNavigation(`/${currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid}/shelves`)}>
          <Ionicons_1.default name='book-outline' size={24} color='#FFFFFF'/>
          <react_native_1.Text style={styles.menuText}>Shelves</react_native_1.Text>
        </react_native_1.Pressable>

        <react_native_1.Pressable style={({ pressed }) => [styles.navItem, pressed && styles.menuItemPressed]} onPress={() => handleNavigation(`/${currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid}/integrations`)}>
          <Ionicons_1.default name='link-outline' size={24} color='#FFFFFF'/>
          <react_native_1.Text style={styles.menuText}>Integrations</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>

      {/* Toast Notification */}
      {showToast && (<react_native_1.View style={styles.toast}>
          <react_native_1.Text style={styles.toastText}>{toastMessage}</react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
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
exports.default = SidePanel;
//# sourceMappingURL=SidePanel.js.map