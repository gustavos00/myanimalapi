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
const AS = __importStar(require("../../schemas/animalSchema"));
const Locality_1 = __importDefault(require("../../models/Locality"));
const Animal_1 = __importDefault(require("../../models/Animal"));
const User_1 = __importDefault(require("../../models/User"));
const Address_1 = __importDefault(require("../../models/Address"));
const Parish_1 = __importDefault(require("../../models/Parish"));
let nodeGeocoder = require('node-geocoder');
let options = {
    provider: 'openstreetmap',
};
const findMyAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let userId;
    let responseData;
    let addressData;
    let cleanResponse;
    try {
        validatedData = yield AS.findMyAnimalSchema.validateAsync({
            trackNumber: req.query.tracking,
        });
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on findMyAnimal animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Try find animal
    try {
        const response = yield Animal_1.default.findOne({
            where: validatedData,
        });
        userId = response === null || response === void 0 ? void 0 : response.userIdUser;
    }
    catch (e) {
        console.log('Error finding owner id on animal table on findMyAnimal animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    if (userId === undefined) {
        //Try find animal owner
        res.status(500).send({ message: 'Cannot find animal owner' });
        return;
    }
    try {
        const response = yield User_1.default.findOne({
            where: {
                idUser: userId,
            },
            raw: true,
            nest: true,
            include: [
                {
                    model: Address_1.default,
                    required: false,
                    include: [
                        {
                            model: Parish_1.default,
                            required: false,
                            include: [
                                {
                                    model: Locality_1.default,
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        cleanResponse = response;
        addressData = cleanResponse.address;
        responseData = {
            name: `${response === null || response === void 0 ? void 0 : response.givenName} ${response === null || response === void 0 ? void 0 : response.familyName}`,
            email: response === null || response === void 0 ? void 0 : response.email,
            phoneNumber: response === null || response === void 0 ? void 0 : response.phoneNumber,
        };
    }
    catch (e) {
        console.log('Error finding owner address on animal table on findMyAnimal animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const { streetName, postalCode } = addressData;
        const geoCoder = nodeGeocoder(options);
        const res = yield geoCoder.geocode(`${streetName} ${postalCode}`);
        if (res.length === 1) {
            const latitude = res[0].latitude;
            const longitude = res[0].longitude;
            responseData = Object.assign(Object.assign({}, responseData), { latitude,
                longitude });
        }
        else {
            const { parishName, locality } = addressData.parish;
            const { locationName } = locality;
            responseData = Object.assign(Object.assign({}, responseData), { doorNumber: addressData.doorNumber, streetName: addressData.streetName, postalCode: addressData.postalCode, parishName,
                locationName });
        }
    }
    catch (e) {
        console.log('Error getting address geographic coordinates on findMyAnimal animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send(responseData);
});
exports.default = findMyAnimal;
