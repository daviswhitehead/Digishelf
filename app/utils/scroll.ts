export const SCROLL_SETTINGS = {
  SPEED: 0.8, // Pixels per frame
  RESET_DURATION: 1000, // Duration of scroll-to-top animation in ms
} as const;

interface ScrollPositions {
  currentOffset: number;
  maxScroll: number;
}

export const getScrollPositions = (): ScrollPositions => ({
  currentOffset: window.pageYOffset || document.documentElement.scrollTop,
  maxScroll: document.documentElement.scrollHeight - window.innerHeight,
});

export const scrollToPosition = (position: number, behavior: ScrollBehavior = 'auto'): void => {
  window.scrollTo({
    top: position,
    behavior,
  });
};
