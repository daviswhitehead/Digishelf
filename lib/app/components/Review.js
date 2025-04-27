"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Review = ({ review, color }) => <react_native_1.Text style={[styles.review, { color }]}>{review}</react_native_1.Text>;
const styles = react_native_1.StyleSheet.create({
    review: {
        fontSize: 12,
    },
});
exports.default = Review;
//# sourceMappingURL=Review.js.map