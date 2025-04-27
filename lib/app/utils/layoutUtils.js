"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalWidth = exports.getResponsiveValues = void 0;
const layout_1 = require("../constants/layout");
const useResponsive_1 = require("../utils/useResponsive");
const getCardDimensionsForWidth = windowWidth => {
    if (windowWidth < useResponsive_1.breakpoints.mobile)
        return layout_1.CARD_DIMENSIONS.MOBILE;
    if (windowWidth < useResponsive_1.breakpoints.tablet)
        return layout_1.CARD_DIMENSIONS.TABLET;
    return layout_1.CARD_DIMENSIONS.DESKTOP;
};
const calculateAvailableWidth = (windowWidth, margin) => {
    return windowWidth - margin * 2;
};
const calculateMaxColumns = (availableWidth, minCardWidth, margin) => {
    return Math.floor(availableWidth / (minCardWidth + margin));
};
const constrainCardWidth = (calculatedWidth, { minWidth, maxWidth }) => {
    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
};
const getResponsiveValues = windowWidth => {
    const margin = layout_1.SPACING.MAX_MARGIN;
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
exports.getResponsiveValues = getResponsiveValues;
const calculateTotalWidth = (numColumns, cardWidth, margin) => {
    return cardWidth * numColumns + margin * (numColumns - 1);
};
exports.calculateTotalWidth = calculateTotalWidth;
//# sourceMappingURL=layoutUtils.js.map