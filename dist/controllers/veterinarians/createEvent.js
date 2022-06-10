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
const Events_1 = __importDefault(require("../../models/Events"));
const Files_1 = __importDefault(require("../../models/Files"));
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let validatedData;
    let newEvent;
    //Validate data
    try {
        validatedData = yield VS.createEvent.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on create event controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        console.log(validatedData.date);
        newEvent = yield Events_1.default.create({
            report: validatedData.report,
            date: validatedData.date,
            eventsStatusIdEventsStatus: validatedData.eventsStatusId,
            eventsTypeIdEventsTypes: validatedData.eventsTypesId,
            animalIdAnimal: validatedData.animalId,
        });
    }
    catch (e) {
        console.log('Error creating event on create event controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        const filesDocuments = req.files;
        filesDocuments.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            Files_1.default.create({
                name: element.originalname,
                file: element.location,
                label: element.originalname,
                function: '',
                eventIdEvents: newEvent.idEvents,
            });
        }));
    }
    catch (e) {
        console.log('Error creating files on create event controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res.status(200).send(newEvent);
});
exports.default = createEvent;
