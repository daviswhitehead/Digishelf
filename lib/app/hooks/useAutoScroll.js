"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoScroll = void 0;
const react_1 = require("react");
const scroll_1 = require("../utils/scroll");
const useAutoScroll = isPlaying => {
    const animationFrameRef = (0, react_1.useRef)(null);
    const isResettingRef = (0, react_1.useRef)(false);
    const scroll = () => {
        const { currentOffset, maxScroll } = (0, scroll_1.getScrollPositions)();
        if (currentOffset >= maxScroll && !isResettingRef.current) {
            handleScrollReset();
        }
        else if (!isResettingRef.current) {
            continueScrolling(currentOffset);
        }
    };
    const handleScrollReset = () => {
        isResettingRef.current = true;
        (0, scroll_1.scrollToPosition)(0, 'smooth');
        setTimeout(() => {
            isResettingRef.current = false;
            if (isPlaying) {
                animationFrameRef.current = requestAnimationFrame(scroll);
            }
        }, scroll_1.SCROLL_SETTINGS.RESET_DURATION);
    };
    const continueScrolling = currentOffset => {
        (0, scroll_1.scrollToPosition)(currentOffset + scroll_1.SCROLL_SETTINGS.SPEED);
        animationFrameRef.current = requestAnimationFrame(scroll);
    };
    (0, react_1.useEffect)(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(scroll);
        }
        else {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isPlaying]);
};
exports.useAutoScroll = useAutoScroll;
//# sourceMappingURL=useAutoScroll.js.map