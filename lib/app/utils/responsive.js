"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponsiveStyle = void 0;
const react_native_1 = require("react-native");
const createResponsiveStyle = stylesByBreakpoint => {
    return react_native_1.StyleSheet.create(Object.assign(Object.assign({}, stylesByBreakpoint.base), { '@media (min-width: 768px)': Object.assign({}, stylesByBreakpoint.tablet), '@media (min-width: 1024px)': Object.assign({}, stylesByBreakpoint.desktop) }));
};
exports.createResponsiveStyle = createResponsiveStyle;
//# sourceMappingURL=responsive.js.map