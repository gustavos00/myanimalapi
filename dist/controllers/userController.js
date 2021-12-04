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
exports.createUser = void 0;
const US = __importStar(require("../schemas/userSchema"));
const Animal_1 = require("../models/Animal");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Joi = require('joi');
const JWD = require('jsonwebtoken');
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userAnimalData = [];
    const { location, key } = req.file;
    try {
        const validatedData = yield US.createUserSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
        const token = JWD.sign({
            email: validatedData,
        }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '');
        const response = yield User_1.user.findOrCreate({
            where: {
                email: (_b = validatedData.email) !== null && _b !== void 0 ? _b : '',
            },
            defaults: Object.assign(Object.assign({}, validatedData), { token }),
        });
        const [data, created] = response;
        const returnStatus = created ? 201 : 200;
        const returnToken = created ? token : data.token;
        //Check if wasnt create
        if (!created) {
            //Find all animals from user
            const response = yield Animal_1.animal.findAll({
                where: {
                    user_idUser: data.idUser,
                },
            });
            response.forEach((item) => {
                userAnimalData.push(item);
            });
            /*Find user address - Need make the relations on models
            const addressResponse = await address.findOne({
              where: { idAddress: data.address_idAddress },
              include: [
                {
                  model: parish,
                },
                {
                  model: locality,
                },
              ],
            })
            */
        }
        res.status(returnStatus).send(Object.assign(Object.assign({}, validatedData), { token: returnToken, animalData: userAnimalData, imageUrl: location, imageKey: key }));
    }
    catch (e) {
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.createUser = createUser;
