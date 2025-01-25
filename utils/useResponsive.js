import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  // Initialize with default values for server-side rendering
  const [width, setWidth] = useState(1024); // Default desktop width
  const [isMounted, setIsMounted] = useState(false);
  
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    setWidth(windowDimensions.width);
    setIsMounted(true);
  }, [windowDimensions.width]);

  // Return default values during server-side rendering
  if (!isMounted) {
    return {
      width: 1024,
      isMobile: false,
      isTablet: false,
      isDesktop: true
    };
  }

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024
  };
};

// Breakpoint constants for consistent usage
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
}; 