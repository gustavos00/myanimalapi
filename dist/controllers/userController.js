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
exports.generateToken = exports.status = exports.createAddress = exports.createUser = void 0;
const US = __importStar(require("../schemas/userSchema"));
const Animal_1 = __importDefault(require("../models/Animal"));
const User_1 = __importDefault(require("../models/User"));
const Address_1 = __importDefault(require("../models/Address"));
const dotenv_1 = __importDefault(require("dotenv"));
const Parish_1 = __importDefault(require("../models/Parish"));
const Locality_1 = __importDefault(require("../models/Locality"));
dotenv_1.default.config();
const JWD = require('jsonwebtoken');
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userAnimalData = [];
    const { location, key } = req.file;
    let returnStatus;
    let returnToken;
    let userAddressTempObj = {};
    try {
        const validatedData = yield US.createUserSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
        const token = JWD.sign({
            email: validatedData,
        }, process.env.JWT_SECRET);
        const response = yield User_1.default.findOrCreate({
            where: {
                email: (_a = validatedData.email) !== null && _a !== void 0 ? _a : '',
            },
            defaults: Object.assign(Object.assign({}, validatedData), { imageUrl: location, imageName: key, token }),
        });
        const [data, created] = response;
        returnStatus = created ? 201 : 200;
        returnToken = created ? token : data.token;
        //Check if wasnt create
        if (!created) {
            //Find all animals from user
            const response = yield Animal_1.default.findAll({
                where: {
                    userIdUser: data.idUser,
                },
            });
            response.forEach((item) => {
                userAnimalData.push(item);
            });
            if (data.addressIdAddress) {
                const addressResponse = yield Address_1.default.findOne({
                    where: { idAddress: data.addressIdAddress },
                    include: [
                        {
                            model: Parish_1.default,
                            include: [
                                {
                                    model: Locality_1.default,
                                },
                            ],
                        },
                    ],
                });
                if (addressResponse) {
                    const { doorNumber, postalCode, streetName, parish: parishData, } = addressResponse;
                    const { parishName, locality: localityData } = parishData;
                    const { locationName } = localityData;
                    userAddressTempObj = {
                        doorNumber,
                        postalCode,
                        streetName,
                        parishName,
                        locationName,
                    };
                }
            }
        }
        res.status(returnStatus).send(Object.assign(Object.assign({}, validatedData), { token: returnToken, imageUrl: location, imageKey: key, animalData: userAnimalData, userAddress: userAddressTempObj }));
    }
    catch (e) {
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.createUser = createUser;
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let addressResponse;
    //Validate data
    try {
        validatedData = yield US.createAddressSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on create user address controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        addressResponse = yield Address_1.default.create(validatedData);
    }
    catch (e) {
        console.log('Error creating user address on user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        yield User_1.default.update({ addressIdAddress: addressResponse.idAddress }, { where: { email: validatedData.email } });
    }
    catch (e) {
        console.log('Error updating user address fk on user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send(validatedData);
});
exports.createAddress = createAddress;
const status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let createResponse;
    //Validate data
    try {
        validatedData = yield US.statusSchema.validateAsync(req.query);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on create user address controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const createResponse = yield User_1.default.create(validatedData);
        res.status(200).send(createResponse);
    }
    catch (e) {
        console.log('Error creating data on create user address controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.status = status;
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    try {
        validatedData = yield US.generateTokenSchema.validateAsync(req.query);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log(e);
        res.status(200).send({ message: 'Something went wrong' });
    }
    try {
        const token = yield JWD.sign({
            email: validatedData,
        }, process.env.JWT_SECRET);
        res.status(200).send({ token });
    }
    catch (e) {
        console.log(e);
        res.status(200).send({ message: 'Something went wrong' });
    }
});
exports.generateToken = generateToken;
