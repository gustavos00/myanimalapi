"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createAnimal_1 = __importDefault(require("../controllers/animal/createAnimal"));
const deleteAnimal_1 = __importDefault(require("../controllers/animal/deleteAnimal"));
const findMyAnimal_1 = __importDefault(require("../controllers/animal/findMyAnimal"));
const updateAnimal_1 = __importDefault(require("../controllers/animal/updateAnimal"));
findMyAnimal_1.default;
const multer = require('multer');
const multerConfig = require('../config/multer');
const router = (0, express_1.Router)();
router.post('/create', multer(multerConfig).single('animalPhoto'), createAnimal_1.default);
router.post('/update/', multer(multerConfig).single('animalPhoto'), updateAnimal_1.default);
router.delete('/delete/:id', deleteAnimal_1.default);
router.get('/findMyAnimal/', findMyAnimal_1.default);
exports.default = router;
