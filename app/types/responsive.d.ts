export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveState {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLoading: boolean;
}
