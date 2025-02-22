import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
};

export const useResponsive = () => {
  const [width, setWidth] = useState(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
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
      isLoading: true
    };
  }

  return {
    width,
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isDesktop: width >= breakpoints.tablet,
    isLoading: false
  };
}; 