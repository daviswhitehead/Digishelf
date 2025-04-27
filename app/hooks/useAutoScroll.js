import { useRef, useEffect } from 'react';
import { SCROLL_SETTINGS, getScrollPositions, scrollToPosition } from '../utils/scroll';

export const useAutoScroll = isPlaying => {
  const animationFrameRef = useRef(null);
  const isResettingRef = useRef(false);

  const scroll = () => {
    const { currentOffset, maxScroll } = getScrollPositions();

    if (currentOffset >= maxScroll && !isResettingRef.current) {
      handleScrollReset();
    } else if (!isResettingRef.current) {
      continueScrolling(currentOffset);
    }
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

  const continueScrolling = currentOffset => {
    scrollToPosition(currentOffset + SCROLL_SETTINGS.SPEED);
    animationFrameRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(scroll);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying]);
};
