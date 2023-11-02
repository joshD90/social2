"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const capitaliseFirstLetter = (str) => {
    if (str === "")
        return "";
    const firstLetter = str[0].toUpperCase();
    const remainder = str.slice(1);
    return firstLetter + remainder;
};
exports.default = capitaliseFirstLetter;
