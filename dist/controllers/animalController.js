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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnimal = exports.createAnimal = void 0;
const AS = __importStar(require("../schemas/animalSchema"));
const Animal_1 = require("../models/Animal");
const User_1 = require("../models/User");
const createAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
    let userId;
    //Validate data
    try {
        validatedData = yield AS.createAnimalSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invaid inputs' });
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
        const response = yield User_1.user.findOne({
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
    try {
        const response = yield Animal_1.animal.findOne({
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
        const response = yield Animal_1.animal.create(Object.assign(Object.assign({}, validatedData), { user_idUser: userId, imageUrl: location, imageName: key }));
        res.status(201).send(response);
    }
    catch (e) {
        console.log('Error creating animal on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.createAnimal = createAnimal;
const deleteAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    //Validate data
    try {
        validatedData = yield AS.deleteAnimalSchema.validateAsync(req.params);
        if (!validatedData) {
            res.status(400).send({ message: 'Invaid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on delete animal controller');
        res.status(400).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Verifying if animal exist
    try {
        const response = yield Animal_1.animal.findOne({
            where: {
                idAnimal: validatedData.id,
            },
        });
        if (!response) {
            res.status(200).send({ message: 'Animal dont exist' });
            return;
        }
    }
    catch (e) {
        console.log('Error verifying if animal exist on delete animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Deleting animal
    try {
        yield Animal_1.animal.destroy({
            where: { idAnimal: validatedData.id },
        });
        res.status(200).send({ message: 'Animal deleted' });
    }
    catch (e) {
        console.log('Error deleting data on delete animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.deleteAnimal = deleteAnimal;
