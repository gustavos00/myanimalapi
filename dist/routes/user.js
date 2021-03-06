"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require('multer');
const multerConfig = require('../config/multer');
const LoginUser_1 = __importDefault(require("../controllers/user/LoginUser"));
const getAllFriendsRequests_1 = __importDefault(require("../controllers/user/getAllFriendsRequests"));
const storeExpoToken_1 = __importDefault(require("../controllers/user/storeExpoToken"));
const updateUser_1 = __importDefault(require("../controllers/user/updateUser"));
const verifyAccessToken_1 = __importDefault(require("../controllers/user/verifyAccessToken"));
const createAddress_1 = __importDefault(require("../controllers/user/createAddress"));
const acceptFriendsRequest_1 = __importDefault(require("../controllers/user/acceptFriendsRequest"));
const getAllFriends_1 = __importDefault(require("../controllers/user/getAllFriends"));
const declineFriendsRequest_1 = __importDefault(require("../controllers/user/declineFriendsRequest"));
const generateAndVerifyQRToken_1 = require("../controllers/user/generateAndVerifyQRToken");
const router = (0, express_1.Router)();
router.post('/create', multer(multerConfig).single('userPhoto'), LoginUser_1.default);
router.post('/update', multer(multerConfig).single('userPhoto'), updateUser_1.default);
router.post('/createAddress', createAddress_1.default);
router.post('/expoToken', storeExpoToken_1.default);
router.get('/friends/getPending/', getAllFriendsRequests_1.default);
router.get('/friends/getAccepted/', getAllFriends_1.default);
router.post('/friends/token/', generateAndVerifyQRToken_1.generateToken);
router.post('/friends/verifyToken/', generateAndVerifyQRToken_1.verifyToken);
router.post('/friends/accept/', acceptFriendsRequest_1.default);
router.post('/friends/decline/', declineFriendsRequest_1.default);
router.post('/access/verify/', verifyAccessToken_1.default);
exports.default = router;
