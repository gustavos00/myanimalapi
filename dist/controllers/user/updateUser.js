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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const US = __importStar(require("../../schemas/userSchema"));
const User_1 = __importDefault(require("../../models/User"));
const Address_1 = __importDefault(require("../../models/Address"));
const Parish_1 = __importDefault(require("../../models/Parish"));
const removeSpecificKey = ({ object, key }) => {
    const _a = object, _b = key, deletedKey = _a[_b], otherKeys = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return otherKeys;
};
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
    let addressId;
    let parishId;
    let localityId;
    //Validate data
    try {
        validatedData = yield US.UpdateUserSchema.validateAsync(req.body);
        if (!validatedData) {
            res.status(400).send({ message: 'Invalid inputs' });
            return;
        }
    }
    catch (e) {
        console.log('Error validating user data on update user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    //ADDRESS
    try {
        if (JSON.parse(validatedData.idAddress) === null) {
            const item = yield Address_1.default.create({
                doorNumber: validatedData.doorNumber,
                postalCode: validatedData.postalCode,
                streetName: validatedData.streetName,
            });
            addressId = item.idAddress;
        }
        else {
            yield Address_1.default.update({
                doorNumber: validatedData.doorNumber,
                postalCode: validatedData.postalCode,
                streetName: validatedData.streetName,
            }, { where: { idAddress: validatedData.idAddress } });
        }
    }
    catch (e) {
        console.log(e);
    }
    //PARISH
    try {
        if (JSON.parse(validatedData.parishName) === null) {
            const item = yield Parish_1.default.create({
                parishName: validatedData.parishName,
            });
            parishId = item.idParish;
        }
        else {
            const response = yield Parish_1.default.update({
                parishName: validatedData.parishName,
            }, { where: { parishName: validatedData.parishName } });
        }
    }
    catch (e) {
        console.log(e);
    }
    try {
        const validatedDataWithoutEmail = removeSpecificKey({
            object: validatedData,
            key: 'email',
        });
        yield User_1.default.update(Object.assign(Object.assign({}, validatedDataWithoutEmail), { photoName: key, photoUrl: location, addressIdAddress: addressId }), { where: { idUser: Number(validatedData.id) } });
    }
    catch (e) {
        console.log('Error updating user data on update user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
    const addressObject = {
        doorNumber: validatedData.doorNumber,
        postalCode: validatedData.postalCode,
        streetName: validatedData.streetName,
        parishName: validatedData.parish,
        locationName: validatedData.locality,
    };
    //verify if all data exist
    // try {
    //   if(JSON.parse(validatedData.idAddress) === null) {
    //     const item = await address.create({
    //       doorNumber: validatedData.doorNumber,
    //       postalCode: validatedData.postalCode,
    //       streetName: validatedData.streetName,
    //     });
    //     //UPDATE USER
    //   } else {
    //     await address.update(
    //       {
    //         doorNumber: validatedData.doorNumber,
    //         postalCode: validatedData.postalCode,
    //         streetName: validatedData.streetName,
    //       },
    //       { where: { idAddress: validatedData.idAddress } }
    //     );
    //   }
    // } catch(e) {
    //   console.log(e)
    // }
    res.status(200).send(Object.assign(Object.assign({}, validatedData), { photoName: key, photoUrl: location, userAddress: addressObject }));
});
exports.default = UpdateUser;
