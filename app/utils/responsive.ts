import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

type StylesByBreakpoint<T> = {
  [key: string]: NamedStyles<T>;
};

const BREAKPOINTS = {
  small: 640,
  medium: 768,
  large: 1024,
  xlarge: 1280,
};

export const createResponsiveStyle = <T extends Record<string, unknown>>(
  stylesByBreakpoint: StylesByBreakpoint<T>
) => {
  return StyleSheet.create({
    ...stylesByBreakpoint.base,
    [`@media (min-width: ${BREAKPOINTS.small}px)`]: {
      ...stylesByBreakpoint.small,
    },
    [`@media (min-width: ${BREAKPOINTS.medium}px)`]: {
      ...stylesByBreakpoint.medium,
    },
    [`@media (min-width: ${BREAKPOINTS.large}px)`]: {
      ...stylesByBreakpoint.large,
    },
    [`@media (min-width: ${BREAKPOINTS.xlarge}px)`]: {
      ...stylesByBreakpoint.xlarge,
    },
  });
};
