"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ionicons_ttf_1 = __importDefault(require("react-native-vector-icons/Fonts/Ionicons.ttf"));
// Only run on client side
if (typeof document !== 'undefined') {
    const iconFontStyles = `@font-face {
    src: url(${Ionicons_ttf_1.default});
    font-family: Ionicons;
  }`;
    // Create stylesheet
    const style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = iconFontStyles;
    }
    else {
        style.appendChild(document.createTextNode(iconFontStyles));
    }
    // Inject stylesheet
    document.head.appendChild(style);
}
//# sourceMappingURL=iconFont.js.map