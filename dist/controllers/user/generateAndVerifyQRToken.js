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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const notifications_1 = require("../../utils/notifications");
const User_1 = __importDefault(require("../../models/User"));
const US = __importStar(require("../../schemas/userSchema"));
const Friends_1 = __importDefault(require("../../models/Friends"));
const JWT = require('jsonwebtoken');
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let token;
    //Validate data
    try {
        validatedData = yield US.generateTokenSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on generate and verify QR controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Generate token
    try {
        token = yield JWT.sign(validatedData, process.env.JWT_SECRET);
    }
    catch (e) {
        console.log('Error decrypting token on generate and verify QR controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send({ token });
});
exports.generateToken = generateToken;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let userData;
    let tokenData;
    let friendRequestHasCreated;
    //Validate data
    try {
        validatedData = yield US.verifyTokenSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on verifyToken controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Decrypting token
    try {
        tokenData = JWT.verify(validatedData.token, process.env.JWT_SECRET);
    }
    catch (e) {
        console.log('Error verifing token on verifyToken controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Finding user
    try {
        userData = yield User_1.default.findOne({
            where: { email: tokenData.email, isVeterinarian: false },
        });
    }
    catch (e) {
        console.log('Error finding user by token on verifyToken controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const response = yield Friends_1.default.findOrCreate({
            where: {
                userFriendsIdToWho: userData === null || userData === void 0 ? void 0 : userData.idUser,
                userFriendsIdFromWho: validatedData.fromWho,
            },
            defaults: {
                userFriendsIdToWho: userData === null || userData === void 0 ? void 0 : userData.idUser,
                userFriendsIdFromWho: validatedData.fromWho,
            },
        });
        friendRequestHasCreated = !response[1];
        friendRequestHasCreated
            ? res.status(200).send({ message: 'Friend relatioship already exist' })
            : res.status(201).send({ message: 'created' });
    }
    catch (e) {
        console.log('Error creating friends request on verifyToken controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    if (friendRequestHasCreated) {
        const receipt = yield (0, notifications_1.sendNotifications)({
            expoToken: userData === null || userData === void 0 ? void 0 : userData.expoToken,
            title: 'Friend Request',
            message: 'Hello! Someone send you a friend request!',
            data: { do: 'openScreen', screenName: 'friendsRequests' },
        });
    }
});
exports.verifyToken = verifyToken;
