"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToPosition = exports.getScrollPositions = exports.SCROLL_SETTINGS = void 0;
exports.SCROLL_SETTINGS = {
    SPEED: 0.8, // Pixels per frame
    RESET_DURATION: 1000, // Duration of scroll-to-top animation in ms
};
const getScrollPositions = () => ({
    currentOffset: window.pageYOffset || document.documentElement.scrollTop,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
});
exports.getScrollPositions = getScrollPositions;
const scrollToPosition = (position, behavior = 'auto') => {
    window.scrollTo({
        top: position,
        behavior,
    });
};
exports.scrollToPosition = scrollToPosition;
//# sourceMappingURL=scroll.js.map