"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const react_native_1 = require("react-native");
function Home() {
    const router = (0, router_1.useRouter)();
    const handleGetStarted = () => {
        router.push('/login');
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.title}>Welcome to DigiShelf</react_native_1.Text>
      <react_native_1.Text style={styles.subtitle}>Your digital shelf for managing books, games, and more.</react_native_1.Text>
      <react_native_1.TouchableOpacity onPress={handleGetStarted} style={styles.button}>
        <react_native_1.Text style={styles.buttonText}>Get Started</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 50,
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        marginBottom: 20,
        color: '#fff',
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 40,
        color: '#fff',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});
//# sourceMappingURL=index.js.map