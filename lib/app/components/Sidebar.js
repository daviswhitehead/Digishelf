"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const react_native_1 = require("react-native");
const Sidebar = () => {
    const router = (0, router_1.useRouter)();
    const { userId } = router.query;
    const links = [
        { name: 'Profile', path: `/${userId}` },
        { name: 'Integrations', path: `/${userId}/integrations` },
        { name: 'Shelves', path: `/${userId}/shelves` },
    ];
    return (<react_native_1.View style={styles.sidebar}>
      <react_native_1.Text style={styles.title}>DigiShelf</react_native_1.Text>
      <react_native_1.View style={styles.linkContainer}>
        {links.map(link => (<react_native_1.TouchableOpacity key={link.name} onPress={() => router.push(link.path)} style={[styles.link, router.pathname === link.path && styles.activeLink]}>
            <react_native_1.Text style={[styles.linkText, router.pathname === link.path && styles.activeLinkText]}>
              {link.name}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>))}
      </react_native_1.View>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    sidebar: {
        width: 250,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        height: '100vh',
        padding: 20,
        position: 'fixed',
        top: 0,
        left: 0,
    },
    title: {
        marginBottom: 20,
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
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
exports.default = Sidebar;
//# sourceMappingURL=Sidebar.js.map