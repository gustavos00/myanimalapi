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
const VS = __importStar(require("../../schemas/veterinarianSchema"));
const Animal_1 = __importDefault(require("../../models/Animal"));
const updateVeterinarianStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    console.log(req.query);
    console.log(req.body);
    //Validate data
    try {
        validatedData = yield VS.updateVeterinarianStatus.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on update event controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        Animal_1.default.update({
            veterinarianAcceptedRequest: true,
        }, {
            where: { idAnimal: validatedData.id },
        });
    }
    catch (e) {
        console.log('Error updating user data on update event controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send({ data: validatedData });
});
exports.default = updateVeterinarianStatus;
