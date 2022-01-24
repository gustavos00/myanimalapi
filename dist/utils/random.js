"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandom = () => {
    const randomString = (Math.random() + 1).toString(36).substring(7);
    return randomString;
};
exports.default = generateRandom;
