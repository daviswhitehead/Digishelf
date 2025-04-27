"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const qrcode_react_1 = require("qrcode.react");
const QRCodeComponent = ({ url, size = 100 }) => {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.qrContainer}>
        <qrcode_react_1.QRCodeSVG value={url} size={size} bgColor='#ffffff' fgColor='#000000' level='L' includeMargin={false}/>
      </react_native_1.View>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        height: 'auto',
        backgroundColor: 'white',
    },
    qrContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
exports.default = QRCodeComponent;
//# sourceMappingURL=QRCode.js.map