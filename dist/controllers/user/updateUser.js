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
const removeSpecificKey = ({ object, key }) => {
    const _a = object, _b = key, deletedKey = _a[_b], otherKeys = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return otherKeys;
};
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, key } = req.file;
    let validatedData;
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
    try {
        const validatedDataWithoutEmail = removeSpecificKey({
            object: validatedData,
            key: 'email',
        });
        yield User_1.default.update(Object.assign(Object.assign({}, validatedDataWithoutEmail), { photoName: key, photoUrl: location }), { where: { idUser: Number(validatedData.id) } });
        const addressObject = {
            doorNumber: validatedData.doorNumber,
            postalCode: validatedData.postalCode,
            streetName: validatedData.streetName,
            parishName: validatedData.parish,
            locationName: validatedData.locality,
        };
        const userObject = {
            familyName: validatedData.familyName,
            givenName: validatedData.givenName,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
            photoName: key,
            photoUrl: location,
        };
        res.status(200).send(Object.assign(Object.assign({}, userObject), { userAddress: addressObject }));
    }
    catch (e) {
        console.log('Error updating user data on update user controller');
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
    }
});
exports.default = UpdateUser;
