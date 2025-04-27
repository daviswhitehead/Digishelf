"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Star_1 = __importDefault(require("./Star"));
const Rating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<Star_1.default key={i} filled={i < rating}/>);
    }
    return (<react_native_1.View style={{
            flexDirection: 'row',
        }}>
      {stars}
    </react_native_1.View>);
};
exports.default = Rating;
//# sourceMappingURL=Rating.js.map