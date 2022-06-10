"use strict";
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
const EventsStatus_1 = __importDefault(require("../../models/EventsStatus"));
const EventsTypes_1 = __importDefault(require("../../models/EventsTypes"));
const getAllEventsProps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let eventsTypesData;
    let eventsStatusData;
    try {
        eventsTypesData = yield EventsTypes_1.default.findAll({
            raw: true,
        });
    }
    catch (e) {
        console.log('Error finding all animals on get all veterinarian events props requests controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    try {
        eventsStatusData = yield EventsStatus_1.default.findAll({
            raw: true,
        });
    }
    catch (e) {
        console.log('Error finding all animals on get all veterinarian events props requests controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    res
        .status(200)
        .send({ eventsTypes: eventsTypesData, eventsStatus: eventsStatusData });
});
exports.default = getAllEventsProps;
