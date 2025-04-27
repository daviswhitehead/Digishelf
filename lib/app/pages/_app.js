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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useUser_1 = require("../utils/useUser");
// Import the icon font loader only on client side
function loadIconFont() {
    if (typeof window !== 'undefined') {
        require('../utils/iconFont');
    }
}
function App({ Component, pageProps }) {
    (0, react_1.useEffect)(() => {
        loadIconFont();
    }, []);
    return (<useUser_1.UserProvider>
      <react_native_1.View style={styles.root}>
        <Component {...pageProps}/>
      </react_native_1.View>
    </useUser_1.UserProvider>);
}
const styles = react_native_1.StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000000',
        minHeight: '100vh', // Ensure full viewport height
    },
});
// Register your app
if (typeof window !== 'undefined') {
    react_native_1.AppRegistry.registerComponent('App', () => App);
}
exports.default = App;
//# sourceMappingURL=_app.js.map