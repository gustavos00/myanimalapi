"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const general_1 = __importDefault(require("./general"));
const user_1 = __importDefault(require("./user"));
const animal_1 = __importDefault(require("./animal"));
const veterinarians_1 = __importDefault(require("./veterinarians"));
const router = (0, express_1.Router)();
router.use('/general', general_1.default);
router.use('/user', user_1.default);
router.use('/animal', animal_1.default);
router.use('/veterinarian', veterinarians_1.default);
exports.default = router;
