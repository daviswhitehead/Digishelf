import { StyleSheet } from 'react-native';

export const createResponsiveStyle = (stylesByBreakpoint) => {
  return StyleSheet.create({
    ...stylesByBreakpoint.base,
    '@media (min-width: 768px)': {
      ...stylesByBreakpoint.tablet
    },
    '@media (min-width: 1024px)': {
      ...stylesByBreakpoint.desktop
    }
  });
}; 