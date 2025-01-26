export const SCROLL_SETTINGS = {
  SPEED: 0.8,          // Pixels per frame
  RESET_DURATION: 1000, // Duration of scroll-to-top animation in ms
};

export const getScrollPositions = () => ({
  currentOffset: window.pageYOffset || document.documentElement.scrollTop,
  maxScroll: document.documentElement.scrollHeight - window.innerHeight,
});

export const scrollToPosition = (position, behavior = 'auto') => {
  window.scrollTo({
    top: position,
    behavior,
  });
}; 