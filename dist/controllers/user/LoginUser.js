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
const US = __importStar(require("../../schemas/userSchema"));
const Parish_1 = __importDefault(require("../../models/Parish"));
const Locality_1 = __importDefault(require("../../models/Locality"));
const Animal_1 = __importDefault(require("../../models/Animal"));
const User_1 = __importDefault(require("../../models/User"));
const Address_1 = __importDefault(require("../../models/Address"));
const User_2 = __importDefault(require("../../models/User"));
const JWT = require('jsonwebtoken');
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userAnimalData = [];
    const { location, key } = req.file;
    let returnStatus;
    let returnToken;
    let userAddressTempObj = {};
    let validatedData;
    let token;
    let accessToken;
    let userData;
    let veterinarianAddressTempObj;
    //Validate data
    try {
        validatedData = yield US.LoginUserSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on create user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Generate user token
    try {
        token = JWT.sign({
            email: validatedData.email,
            isVeterinarian: validatedData.isVeterinarian,
        }, process.env.JWT_SECRET);
    }
    catch (e) {
        console.log('Error generating user token on create user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Find or create user
    try {
        const response = yield User_2.default.findOrCreate({
            nest: true,
            raw: true,
            where: {
                email: validatedData.email,
                isVeterinarian: validatedData.isVeterinarian,
            },
            defaults: Object.assign(Object.assign({}, validatedData), { isVeterinarian: validatedData.isVeterinarian, photoUrl: location, photoName: key, token }),
            include: [
                {
                    model: Address_1.default,
                    include: [{ model: Parish_1.default, include: [{ model: Locality_1.default }] }],
                },
            ],
        });
        const [data, created] = response;
        const cleanUserData = created ? data.get() : data;
        if (cleanUserData.address) {
            const { doorNumber, postalCode, streetName, parish: parishData, } = cleanUserData.address;
            const { parishName, locality: localityData } = parishData;
            const { locationName } = localityData;
            userAddressTempObj = {
                idAddress: cleanUserData.address.idAddress,
                doorNumber,
                postalCode,
                streetName,
                parishName,
                locationName,
            };
        }
        returnStatus = created ? 201 : 200;
        returnToken = created ? token : data.token;
        userData = {
            data: cleanUserData,
            created,
        };
    }
    catch (e) {
        console.log(e);
        return;
    }
    if (!userData.created) {
        try {
            const response = yield Animal_1.default.findAll({
                where: {
                    userIdUser: userData.data.idUser,
                },
                nest: true,
                raw: true,
                include: [
                    {
                        model: User_1.default,
                        as: 'userVeterinarianFk',
                        include: [
                            {
                                model: Address_1.default,
                                include: [{ model: Parish_1.default, include: [{ model: Locality_1.default }] }],
                            },
                        ],
                    },
                ],
            });
            for (const element of response) {
                const { doorNumber, postalCode, streetName, parish: parishData, } = element.userVeterinarianFk
                    .address;
                const { parishName, locality: localityData } = parishData;
                const { locationName } = localityData;
                veterinarianAddressTempObj = {
                    doorNumber,
                    postalCode,
                    streetName,
                    parishName,
                    locationName,
                };
                const tempObj = Object.assign(Object.assign({}, element), { userVeterinarianFk: Object.assign(Object.assign({}, element.userVeterinarianFk), { veterinarianAddress: veterinarianAddressTempObj }) });
                userAnimalData.push(tempObj);
            }
        }
        catch (e) {
            console.log('Error finding animals from user on create user controller');
            res.status(500).send({ message: 'Something went wrong' });
            throw new Error(e);
        }
    }
    const userCompleteData = Object.assign(Object.assign({}, userData.data), { token: returnToken, accessToken, salt: validatedData.salt, animalData: userAnimalData, userAddress: userAddressTempObj });
    //Generate access user token
    try {
        accessToken = JWT.sign(userCompleteData, validatedData.salt);
    }
    catch (e) {
        console.log('Error generating access user token on create user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(returnStatus).send(Object.assign({}, userCompleteData));
});
exports.default = LoginUser;
