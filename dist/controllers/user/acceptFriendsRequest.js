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
const Friends_1 = __importDefault(require("../../models/Friends"));
const random_1 = __importDefault(require("../../utils/random"));
const US = __importStar(require("../../schemas/userSchema"));
const notifications_1 = require("../../utils/notifications");
const User_1 = __importDefault(require("../../models/User"));
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let validatedData;
    let friendsData;
    const fingerprint = (0, random_1.default)();
    try {
        validatedData = yield US.acceptFriendsSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on accept friend request controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        yield Friends_1.default.update({ status: 'Accepted', fingerprint }, {
            where: {
                idfriends: validatedData.id,
            },
        });
    }
    catch (e) {
        console.log('Error updating friend status on accept friend request controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        friendsData = yield Friends_1.default.findOne({
            where: {
                idfriends: validatedData.id,
            },
            include: [
                { model: User_1.default, as: 'userFriendsIdtoWhoFk' },
                { model: User_1.default, as: 'userFriendsIdFromWhoFk' },
            ],
        });
    }
    catch (e) {
        console.log('Error updating friend status on accept friend request controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    yield (0, notifications_1.sendNotifications)({
        expoToken: (_a = friendsData === null || friendsData === void 0 ? void 0 : friendsData.userFriendsIdFromWhoFk) === null || _a === void 0 ? void 0 : _a.expoToken,
        title: 'Friend Request',
        message: `Hello! ${(_b = friendsData === null || friendsData === void 0 ? void 0 : friendsData.userFriendsIdtoWhoFk) === null || _b === void 0 ? void 0 : _b.givenName} accepted your friend request!`,
        data: { do: 'openScreen', screenName: 'friendsRequests' },
    });
    res.status(200).send({ fingerprint });
});
exports.default = acceptFriendRequest;
