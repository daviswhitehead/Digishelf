"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useResponsive_1 = require("../utils/useResponsive");
const Row = ({ children, spacing = 16 }) => {
    const { isMobile } = (0, useResponsive_1.useResponsive)();
    return (<react_native_1.View style={{
            flexDirection: isMobile ? 'column' : 'row',
            margin: -spacing / 2,
            flexWrap: 'wrap',
        }}>
      {react_1.default.Children.map(children, child => (<react_native_1.View style={{ padding: spacing / 2 }}>{child}</react_native_1.View>))}
    </react_native_1.View>);
};
exports.Row = Row;
//# sourceMappingURL=Grid.js.map