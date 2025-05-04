interface _CardDimensions {
  width: number;
  height: number;
}

interface CardConstraints {
  minWidth: number;
  maxWidth: number;
}

const calculateAvailableWidth = (windowWidth: number, margin: number): number => {
  return windowWidth - margin * 2;
};

const calculateMaxColumns = (
  availableWidth: number,
  minCardWidth: number,
  margin: number
): number => {
  return Math.floor((availableWidth + margin) / (minCardWidth + margin));
};

const constrainCardWidth = (
  calculatedWidth: number,
  { minWidth, maxWidth }: CardConstraints
): number => {
  return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
};

interface ResponsiveValues {
  columns: number;
  cardWidth: number;
  margin: number;
}

export const getResponsiveValues = (windowWidth: number): ResponsiveValues => {
  const MIN_CARD_WIDTH = 160;
  const MAX_CARD_WIDTH = 300;
  const MIN_MARGIN = 16;
  const MAX_MARGIN = 24;

  const margin = windowWidth < 600 ? MIN_MARGIN : MAX_MARGIN;
  const availableWidth = calculateAvailableWidth(windowWidth, margin);
  const maxColumns = calculateMaxColumns(availableWidth, MIN_CARD_WIDTH, margin);
  const calculatedCardWidth = (availableWidth - (maxColumns - 1) * margin) / maxColumns;
  const cardWidth = constrainCardWidth(calculatedCardWidth, {
    minWidth: MIN_CARD_WIDTH,
    maxWidth: MAX_CARD_WIDTH,
  });

  return {
    columns: maxColumns,
    cardWidth,
    margin,
  };
};

export const calculateTotalWidth = (
  numColumns: number,
  cardWidth: number,
  margin: number
): number => {
  return numColumns * cardWidth + (numColumns - 1) * margin;
};
