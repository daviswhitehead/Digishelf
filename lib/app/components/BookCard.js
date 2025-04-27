"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const layout_1 = require("../constants/layout");
const Rating_1 = __importDefault(require("./Rating"));
const Review_1 = __importDefault(require("./Review"));
const colors_1 = require("../utils/colors");
const getContrastColor = hexColor => {
    // Ensure the hexColor is valid and has 6 characters
    if (!hexColor || hexColor.length !== 7 || hexColor[0] !== '#') {
        return '#000000'; // Default to black if invalid
    }
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Calculate relative luminance using WCAG formula
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
const BookCard = ({ book, cardWidth, margin }) => {
    const [imageHeight, setImageHeight] = (0, react_1.useState)(null);
    const backgroundColor = book.primaryColor
        ? `${book.primaryColor}E6` // Add 90% opacity (E6 in hex)
        : '#f8f8f8';
    const textColor = book.primaryColor ? getContrastColor(book.primaryColor) : '#000';
    (0, react_1.useEffect)(() => {
        if (book.coverImage) {
            react_native_1.Image.getSize(book.coverImage, (imgWidth, imgHeight) => {
                const dynamicHeight = (imgHeight / imgWidth) * cardWidth;
                setImageHeight(dynamicHeight);
            }, () => {
                setImageHeight(null); // Handle error by not setting height
            });
        }
    }, [book.coverImage, cardWidth]);
    if (!book.coverImage) {
        // Do not render if coverImage is null or an empty string
        return null;
    }
    return (<react_native_1.View style={[
            styles.bookCard,
            {
                width: cardWidth,
                backgroundColor,
                marginBottom: margin,
            },
        ]}>
      {/* Image Container */}
      <react_native_1.View style={styles.imageContainer}>
        {imageHeight && (<react_native_1.Image source={{ uri: book.coverImage }} style={[styles.coverImage, { height: imageHeight }]} resizeMode='cover'/>)}
      </react_native_1.View>

      {/* Book Details */}
      {(book.userRating !== null || book.userReview !== '') && (<react_native_1.View style={styles.detailsContainer}>
          {book.userRating !== null && <Rating_1.default rating={book.userRating}/>}
          {book.userReview !== '' && <Review_1.default review={book.userReview} color={textColor}/>}
        </react_native_1.View>)}
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    bookCard: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.1,
        borderColor: '#374151',
        shadowColor: colors_1.shadowColor,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        padding: layout_1.SPACING.IMAGE_PADDING,
    },
    coverImage: {
        width: '100%', // Fixed width
        borderRadius: 10,
    },
    detailsContainer: {
        padding: layout_1.SPACING.CARD_PADDING,
    },
});
exports.default = BookCard;
//# sourceMappingURL=BookCard.js.map