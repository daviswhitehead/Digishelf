import { CARD_DIMENSIONS, SPACING } from '../constants/layout';
import { breakpoints } from '../utils/useResponsive';

const getCardDimensionsForWidth = (windowWidth) => {
  if (windowWidth < breakpoints.mobile) return CARD_DIMENSIONS.MOBILE;
  if (windowWidth < breakpoints.tablet) return CARD_DIMENSIONS.TABLET;
  return CARD_DIMENSIONS.DESKTOP;
};

const calculateAvailableWidth = (windowWidth, margin) => {
  return windowWidth - (margin * 2);
};

const calculateMaxColumns = (availableWidth, minCardWidth, margin) => {
  return Math.floor(availableWidth / (minCardWidth + margin));
};

const constrainCardWidth = (calculatedWidth, { minWidth, maxWidth }) => {
  return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
};

export const getResponsiveValues = (windowWidth) => {
  const margin = SPACING.MAX_MARGIN;
  const cardDimensions = getCardDimensionsForWidth(windowWidth);
  
  const availableWidth = calculateAvailableWidth(windowWidth, margin);
  const maxPossibleColumns = calculateMaxColumns(availableWidth, cardDimensions.minWidth, margin);
  const columns = Math.max(1, maxPossibleColumns);
  
  const totalGapSpace = margin * (columns - 1);
  const cardWidth = Math.floor((availableWidth - totalGapSpace) / columns);
  const finalCardWidth = constrainCardWidth(cardWidth, cardDimensions);

  return {
    columns,
    cardWidth: finalCardWidth,
    margin,
  };
};

export const calculateTotalWidth = (numColumns, cardWidth, margin) => {
  return cardWidth * numColumns + margin * (numColumns - 1);
}; 