"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = About;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function About() {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.text}>About Us</react_native_1.Text>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    text: {
        fontSize: 24,
    },
});
//# sourceMappingURL=about.js.map