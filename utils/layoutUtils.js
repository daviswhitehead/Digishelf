import { CARD_DIMENSIONS, SPACING, COLUMNS } from '../constants/layout';

export const getResponsiveValues = (width, isMobile, isTablet) => {
  // Get breakpoint-specific card width bounds
  const { minWidth, maxWidth } = isMobile 
    ? CARD_DIMENSIONS.MOBILE
    : isTablet 
    ? CARD_DIMENSIONS.TABLET 
    : CARD_DIMENSIONS.DESKTOP;

  // Base margin calculation
  const margin = Math.min(
    isMobile ? SPACING.MOBILE_MARGIN : SPACING.DESKTOP_MARGIN,
    SPACING.MAX_MARGIN
  );

  // Calculate maximum possible columns that could fit with minimum width
  const maxPossibleColumns = Math.floor((width - margin) / (minWidth + margin));
  
  // Determine actual number of columns based on device and constraints
  const columns = isMobile 
    ? COLUMNS.MOBILE 
    : isTablet 
    ? COLUMNS.TABLET 
    : Math.min(
        Math.max(COLUMNS.MIN_DESKTOP, maxPossibleColumns),
        COLUMNS.MAX_DESKTOP || maxPossibleColumns
      );

  // Calculate card width ensuring it stays within bounds
  const availableWidth = width - (margin * (columns + 1));
  const calculatedWidth = availableWidth / columns;
  const cardWidth = Math.min(
    Math.max(calculatedWidth, minWidth),
    maxWidth
  );

  return {
    margin,
    columns,
    cardWidth,
  };
};

export const calculateTotalWidth = (columns, cardWidth, margin) => {
  return (cardWidth * columns) + (margin * (columns + 1));
}; 