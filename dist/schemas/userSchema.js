"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFriendSchema = exports.declineFriendsSchema = exports.acceptFriendsSchema = exports.storeExpoTokenSchema = exports.getAllFriendsDataSchema = exports.verifyAccessTokenSchema = exports.verifyTokenSchema = exports.generateTokenSchema = exports.statusSchema = exports.createAddressSchema = exports.UpdateUserSchema = exports.LoginUserSchema = void 0;
const Joi = require('joi');
exports.LoginUserSchema = Joi.object({
    givenName: Joi.string().required().min(1).max(60),
    familyName: Joi.string().required().min(1).max(60),
    email: Joi.string().required().min(1).email(),
    salt: Joi.string().required().min(1),
    isVeterinarian: Joi.boolean().required(),
});
exports.UpdateUserSchema = Joi.object({
    id: Joi.string().required().min(1),
    idAddress: Joi.string(),
    parishName: Joi.string().min(1).max(100),
    locationName: Joi.string().min(1).max(100),
    streetName: Joi.string().min(1).max(100),
    postalCode: Joi.string().min(1).max(12),
    doorNumber: Joi.string().min(1).max(10),
    givenName: Joi.string().required(),
    familyName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().empty('').optional(null),
    isVeterinarian: Joi.boolean().required(),
});
exports.createAddressSchema = Joi.object({
    parishName: Joi.string().required().min(1).max(100),
    locationName: Joi.string().required().min(1).max(100),
    streetName: Joi.string().required().min(1).max(100),
    postalCode: Joi.string().required().min(1).max(12),
    doorNumber: Joi.string().required().min(1).max(10),
    email: Joi.string().email().required(),
    isVeterinarian: Joi.boolean().required(),
});
exports.statusSchema = Joi.object({
    status: Joi.string().required().min(1).max(100),
});
exports.generateTokenSchema = Joi.object({
    email: Joi.string().required().email(),
    id: Joi.string().required().min(1),
});
exports.verifyTokenSchema = Joi.object({
    token: Joi.string().required().min(1),
    fromWho: Joi.string().required().min(1),
});
exports.verifyAccessTokenSchema = Joi.object({
    token: Joi.string().required().min(1),
    salt: Joi.string().required().min(1),
});
exports.getAllFriendsDataSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.storeExpoTokenSchema = Joi.object({
    expoToken: Joi.string().required().min(1),
    token: Joi.string().required().min(1),
});
exports.acceptFriendsSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.declineFriendsSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.deleteFriendSchema = Joi.object({
    id: Joi.string().required().min(1)
});
