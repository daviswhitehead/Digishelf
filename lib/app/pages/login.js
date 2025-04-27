"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Login_1 = __importDefault(require("../components/Login"));
function Login() {
    return (<react_native_1.View style={styles.container}>
      <Login_1.default />
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
//# sourceMappingURL=login.js.map