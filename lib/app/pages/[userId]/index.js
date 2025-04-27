"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const firebase_1 = require("../../utils/firebase");
const auth_1 = require("firebase/auth");
const useUser_1 = require("../../utils/useUser");
const Sidebar_1 = __importDefault(require("../../components/Sidebar"));
const react_native_1 = require("react-native");
function Profile() {
    const router = (0, router_1.useRouter)();
    const user = (0, useUser_1.useUser)();
    const handleLogout = async () => {
        try {
            await (0, auth_1.signOut)(firebase_1.auth);
            router.push('/login');
        }
        catch (err) {
            console.error(err.message);
        }
    };
    if (!user) {
        return (<react_native_1.View style={styles.container}>
        <Sidebar_1.default />
        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={styles.loadingText}>Loading...</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <Sidebar_1.default />
      <react_native_1.View style={styles.contentWrapper}>
        <react_native_1.ScrollView contentContainerStyle={styles.content}>
          <react_native_1.Text style={styles.title}>Your Profile</react_native_1.Text>
          <react_native_1.View style={styles.jsonContainer}>
            <react_native_1.Text style={styles.jsonText}>{JSON.stringify(user, null, 2)}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <react_native_1.Text style={styles.logoutButtonText}>Logout</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.ScrollView>
      </react_native_1.View>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
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
//# sourceMappingURL=index.js.map