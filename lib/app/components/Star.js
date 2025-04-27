"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const colors_1 = require("../utils/colors");
const Star = ({ filled }) => (<react_native_1.View style={styles.star}>
    <react_native_1.Text style={[styles.starText, filled && styles.filledStar]}>★</react_native_1.Text>
  </react_native_1.View>);
const styles = react_native_1.StyleSheet.create({
    star: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filledStar: {
        color: colors_1.starFilledColor,
    },
    starText: {
        fontSize: 16,
        color: colors_1.starColor,
    },
});
exports.default = Star;
//# sourceMappingURL=Star.js.map