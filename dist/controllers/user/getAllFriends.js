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
const sequelize_1 = require("sequelize");
const Friends_1 = __importDefault(require("../../models/Friends"));
const User_1 = __importDefault(require("../../models/User"));
const US = __importStar(require("../../schemas/userSchema"));
const getAllFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let friendsData;
    let friendArray = [];
    //TODO -> FIX ANY
    try {
        validatedData = yield US.getAllFriendsDataSchema.validateAsync(req.query);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on get all friends controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        friendsData = yield Friends_1.default.findAll({
            nest: true,
            raw: true,
            where: {
                status: 'Accepted',
                [sequelize_1.Op.or]: [{ fromWho: validatedData.id }, { toWhom: validatedData.id }],
            },
            include: [
                { model: User_1.default, as: 'fromWhoFk' },
                { model: User_1.default, as: 'toWhomFk' },
            ],
        });
        friendsData.forEach((element) => {
            let friendData;
            if (element.fromWhoFk.idUser == validatedData.id) {
                friendData = element.toWhomFk;
            }
            if (element.toWhomFk.idUser == validatedData.id) {
                friendData = element.fromWhoFk;
            }
            delete element.toWhomFk;
            delete element.fromWhoFk;
            const friendObj = Object.assign(Object.assign({}, element), { friendData });
            friendArray.push(friendObj);
        });
    }
    catch (e) {
        console.log('Error finding all friends request on get all friends controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send(friendArray);
});
exports.default = getAllFriends;
