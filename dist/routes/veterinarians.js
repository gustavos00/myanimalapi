"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require('multer');
const multerConfig = require('../config/multer');
const removeVeterinarian_1 = __importDefault(require("./../controllers/veterinarians/removeVeterinarian"));
const acceptVeterinarian_1 = __importDefault(require("../controllers/veterinarians/acceptVeterinarian"));
const getAllVeterinarians_1 = __importDefault(require("../controllers/veterinarians/getAllVeterinarians"));
const router = (0, express_1.Router)();
router.get('/get', getAllVeterinarians_1.default);
router.post('/accept', acceptVeterinarian_1.default);
router.post('/remove', removeVeterinarian_1.default);
exports.default = router;
