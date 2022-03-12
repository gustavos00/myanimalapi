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
const Animal_1 = __importDefault(require("../../models/Animal"));
const User_1 = __importDefault(require("../../models/User"));
const createAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
    let userId;
    let createAnimalResponse;
    //Validate data
    try {
        validatedData = yield AS.createAnimalSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Find user id
    try {
        const response = yield User_1.default.findOne({
            where: { token: validatedData.token },
        });
        if (!response) {
            res.status(404).send({ message: 'Cannot find owner data' });
            return;
        }
        userId = response.idUser;
    }
    catch (e) {
        console.log('Error getting owner data on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Finding if tracknumber already exist
    try {
        const response = yield Animal_1.default.findOne({
            where: {
                trackNumber: validatedData.trackNumber,
            },
        });
        if (response) {
            res.status(400).send({ message: 'This track number already exist' });
            return;
        }
    }
    catch (e) {
        console.log('Error verifying if trackCode is on use on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Create animal
    try {
        createAnimalResponse = yield Animal_1.default.create(Object.assign(Object.assign({}, validatedData), { userIdUser: userId, photoUrl: location, photoName: key }));
    }
    catch (e) {
        console.log('Error creating animal on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(201).send(createAnimalResponse);
});
exports.default = createAnimal;
