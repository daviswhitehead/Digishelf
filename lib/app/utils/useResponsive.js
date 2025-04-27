"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponsive = exports.breakpoints = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
exports.breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
};
const useResponsive = () => {
    const [width, setWidth] = (0, react_1.useState)(undefined);
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleResize = () => setWidth(window.innerWidth);
        setWidth(window.innerWidth);
        setIsMounted(true);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    if (!isMounted || typeof width === 'undefined') {
        return {
            width: 0,
            isMobile: false,
            isTablet: false,
            isDesktop: false,
            isLoading: true,
        };
    }
    return {
        width,
        isMobile: width < exports.breakpoints.mobile,
        isTablet: width >= exports.breakpoints.mobile && width < exports.breakpoints.tablet,
        isDesktop: width >= exports.breakpoints.tablet,
        isLoading: false,
    };
};
exports.useResponsive = useResponsive;
//# sourceMappingURL=useResponsive.js.map