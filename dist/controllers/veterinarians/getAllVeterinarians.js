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
const Address_1 = __importDefault(require("../../models/Address"));
const Locality_1 = __importDefault(require("../../models/Locality"));
const Parish_1 = __importDefault(require("../../models/Parish"));
const User_1 = __importDefault(require("../../models/User"));
const getAllVeterinarians = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let veterinarianAddressTempObj = {};
    let response;
    let veterinarianData = [];
    try {
        response = yield User_1.default.findAll({
            where: { isVeterinarian: true },
            raw: true,
            nest: true,
        });
    }
    catch (e) {
        console.log('Error getting all veterinarians on get all veterinarians controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    for (const element of response) { //convert to foreach and promisses
        if (element.addressIdAddress) {
            try {
                const addressResponse = yield Address_1.default.findOne({
                    where: { idAddress: element.addressIdAddress },
                    raw: true,
                    nest: true,
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
                    veterinarianAddressTempObj = {
                        doorNumber,
                        postalCode,
                        streetName,
                        parishName,
                        locationName,
                    };
                }
            }
            catch (e) {
                console.log('Error finding animals from user on create user controller');
                res.status(500).send({ message: 'Something went wrong' });
                throw new Error(e);
            }
        }
        veterinarianData.push(Object.assign(Object.assign({}, element), { veterinarianAddress: veterinarianAddressTempObj }));
    }
    res.status(200).send(veterinarianData);
});
exports.default = getAllVeterinarians;
