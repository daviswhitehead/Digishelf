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
const SidePanel_1 = require("./SidePanel");
const router_1 = require("next/router");
const ShelfHeader = ({ title, subtitle, isPlaying, onPlayPausePress, scrollPosition, onMenuToggle, isPanelVisible, }) => {
    if (isPanelVisible)
        return null; // Hide ShelfHeader when SidePanel is visible
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.contentContainer}>
        {/* Hamburger Menu */}
        <react_native_1.Pressable onPress={onMenuToggle} style={styles.iconButton}>
          <Ionicons_1.default name='menu-outline' size={24} color='#000000'/>
        </react_native_1.Pressable>

        {/* Title and Subtitle */}
        <react_native_1.View style={styles.textContainer}>
          <react_native_1.Text style={styles.title}>{title}</react_native_1.Text>
          {subtitle && <react_native_1.Text style={styles.subtitle}>{subtitle}</react_native_1.Text>}
        </react_native_1.View>

        {/* Play/Pause Button */}
        <react_native_1.Pressable onPress={onPlayPausePress} style={styles.iconButton}>
          {({ pressed }) => (<Ionicons_1.default name={isPlaying ? 'pause-outline' : 'play-outline'} size={20} color={pressed ? '#808080' : '#000000'}/>)}
        </react_native_1.Pressable>
      </react_native_1.View>

      {/* Horizontal Scroll Bar */}
      <react_native_1.View style={styles.scrollBarContainer}>
        <react_native_1.View style={[styles.scrollBarIndicator, { width: `${scrollPosition}%` }]}/>
      </react_native_1.View>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1000,
        height: 'auto',
        backgroundColor: 'white',
        maxWidth: 350,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 0,
    },
    subtitle: {
        color: 'gray',
        fontSize: 20,
        fontWeight: 'light',
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
        backgroundColor: '#000000',
    },
    scrollBarIndicator: {
        height: '100%',
        backgroundColor: '#EAB308',
    },
});
exports.default = ShelfHeader;
//# sourceMappingURL=ShelfHeader.js.map