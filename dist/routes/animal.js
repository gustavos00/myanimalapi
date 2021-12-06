"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const animalController = __importStar(require("../controllers/animalController"));
const multer = require('multer');
const multerConfig = require('../config/multer');
const router = (0, express_1.Router)();
router.post('/create', multer(multerConfig).single('animalPhoto'), animalController.createAnimal);
router.post('/update/', multer(multerConfig).single('animalPhoto'), animalController.updateAnimal);
router.delete('/delete/:id', animalController.deleteAnimal);
router.get('/findMyAnimal/', animalController.findMyAnimal);
//router.post('/read')
exports.default = router;
