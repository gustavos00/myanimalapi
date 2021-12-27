"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalController_1 = __importDefault(require("../controllers/generalController"));
const router = (0, express_1.Router)();
router.get('/ping', generalController_1.default);
exports.default = router;
