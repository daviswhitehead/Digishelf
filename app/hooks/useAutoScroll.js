import { useRef, useEffect } from 'react';
import { SCROLL_SETTINGS, getScrollPositions, scrollToPosition } from '../utils/scroll';

export const useAutoScroll = isPlaying => {
  const animationFrameRef = useRef(null);
  const isResettingRef = useRef(false);

  useEffect(() => {
    const continueScrolling = currentOffset => {
      scrollToPosition(currentOffset + SCROLL_SETTINGS.SPEED);
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    const handleScrollReset = () => {
      isResettingRef.current = true;
      scrollToPosition(0, 'smooth');

      setTimeout(() => {
        isResettingRef.current = false;
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(scroll);
        }
      }, SCROLL_SETTINGS.RESET_DURATION);
    };

    const scroll = () => {
      const { currentOffset, maxScroll } = getScrollPositions();

      if (currentOffset >= maxScroll && !isResettingRef.current) {
        handleScrollReset();
      } else if (!isResettingRef.current) {
        continueScrolling(currentOffset);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(scroll);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);
};
