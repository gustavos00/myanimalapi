"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require('multer');
const multerConfig = require('../config/multer');
const findOrCreateUser_1 = __importDefault(require("../controllers/user/findOrCreateUser"));
const getAllFriendsRequests_1 = __importDefault(require("../controllers/user/getAllFriendsRequests"));
const updateUser_1 = __importDefault(require("../controllers/user/updateUser"));
const verifyAccessToken_1 = __importDefault(require("../controllers/user/verifyAccessToken"));
const createAddress_1 = __importDefault(require("./../controllers/user/createAddress"));
const generateAndVerifyQRToken_1 = require("./../controllers/user/generateAndVerifyQRToken");
const router = (0, express_1.Router)();
router.post('/create', multer(multerConfig).single('userPhoto'), findOrCreateUser_1.default);
router.post('/update', multer(multerConfig).single('userPhoto'), updateUser_1.default);
router.post('/createAddress', createAddress_1.default);
router.get('/friend/token/', generateAndVerifyQRToken_1.generateToken);
router.get('/friend/get/', getAllFriendsRequests_1.default);
router.get('/friend/verifyToken/', generateAndVerifyQRToken_1.verifyToken);
router.post('/access/verify/', verifyAccessToken_1.default);
exports.default = router;
