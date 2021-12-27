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
exports.findMyAnimal = exports.deleteAnimal = exports.updateAnimal = exports.createAnimal = void 0;
const AS = __importStar(require("../schemas/animalSchema"));
const Locality_1 = __importDefault(require("./../models/Locality"));
const Animal_1 = __importDefault(require("../models/Animal"));
const User_1 = __importDefault(require("../models/User"));
const Address_1 = __importDefault(require("../models/Address"));
const Parish_1 = __importDefault(require("../models/Parish"));
let nodeGeocoder = require('node-geocoder');
let options = {
    provider: 'openstreetmap',
};
const createAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
    let userId;
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
        const response = yield Animal_1.default.create(Object.assign(Object.assign({}, validatedData), { userIdUser: userId, imageUrl: location, imageName: key }));
        res.status(201).send(response);
    }
    catch (e) {
        console.log('Error creating animal on create animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.createAnimal = createAnimal;
const updateAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
    //Validate data
    try {
        validatedData = yield AS.updateAnimalSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on update animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const findResponse = yield Animal_1.default.findOne({
            where: { trackNumber: validatedData.trackNumber },
        });
        //Checking if already exist a trackNumber but from another user
        if (validatedData.trackNumber == (findResponse === null || findResponse === void 0 ? void 0 : findResponse.trackNumber) &&
            validatedData.id != (findResponse === null || findResponse === void 0 ? void 0 : findResponse.idAnimal)) {
            res.status(400).send({ message: 'This track number already exist' });
            return;
        }
    }
    catch (e) {
        console.log('Error getting owner data on update animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const updateResponse = yield Animal_1.default.update(Object.assign(Object.assign({}, validatedData), { imageUrl: location, imageName: key }), {
            where: {
                idAnimal: validatedData.id,
            },
        });
        console.log(updateResponse);
        res.status(200).send(updateResponse);
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ message: 'errr' });
    }
});
exports.updateAnimal = updateAnimal;
const deleteAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    //Validate data
    try {
        validatedData = yield AS.deleteAnimalSchema.validateAsync(req.params);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating data on delete animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //Verifying if animal exist
    try {
        const response = yield Animal_1.default.findOne({
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
        yield Animal_1.default.destroy({
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
const findMyAnimal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let userId;
    let responseData;
    let addressData;
    //Validate data
    const tempTrackNumber = req.query.trackNumber === 'undefined' ? undefined : req.query.trackNumber;
    try {
        validatedData = yield AS.findMyAnimalSchema.validateAsync({
            trackNumber: tempTrackNumber,
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
        res.status(200).send({ message: 'Cannot find animal owner' });
        return;
    }
    try {
        const response = yield User_1.default.findOne({
            where: {
                idUser: userId,
            },
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
        console.log(response);
        responseData = {
            email: response === null || response === void 0 ? void 0 : response.email,
            phoneNumber: response === null || response === void 0 ? void 0 : response.phoneNumber,
        };
    }
    catch (e) {
        console.log('Error finding owner id on animal table on findMyAnimal animal controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    /*try {
      const { streetName, postalCode, parish } = addressData;
      const geoCoder = nodeGeocoder(options);
  
      const res = await geoCoder.geocode(`${streetName} ${postalCode}`);
  
      if (res) {
        const latitude = res[0].latitude;
        const longitude = res[0].longitude;
  
        const tempObj = {
          ...responseData,
          latitude,
          longitude,
        };
  
        responseData = tempObj;
      } else {
        const { parishName, locality } = parish as UserAddressParishProps;
        const { locationName } = locality as UserAddressLocalityProps;
        const tempObj = {
          ...responseData,
          streetName,
          postalCode,
          parishName,
          locationName,
        };
  
        responseData = tempObj;
      }
    } catch (e) {
      console.log(
        'Error getting address geographic coordinates on findMyAnimal animal controller'
      );
  
      res.status(500).send({ message: 'Something went wrong' });
      throw new Error(e as string);
    }*/
    res.status(200).send(responseData);
});
exports.findMyAnimal = findMyAnimal;
