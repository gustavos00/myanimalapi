"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendsSchema = exports.storeExpoTokenSchema = exports.getAllFriendsDataSchema = exports.verifyAccessTokenSchema = exports.verifyTokenSchema = exports.generateTokenSchema = exports.statusSchema = exports.createAddressSchema = exports.UpdateUserSchema = exports.findOrCreateUserSchema = void 0;
const Joi = require('joi');
exports.findOrCreateUserSchema = Joi.object({
    givenName: Joi.string().required().min(1).max(60),
    familyName: Joi.string().required().min(1).max(60),
    email: Joi.string().required().min(1).email(),
    salt: Joi.string().required().min(1),
});
exports.UpdateUserSchema = Joi.object({
    streetName: Joi.string().required(),
    doorNumber: Joi.string().required(),
    postalCode: Joi.string().required(),
    parish: Joi.string().required(),
    locality: Joi.string().required(),
    givenName: Joi.string().required(),
    familyName: Joi.string().required(),
    phoneNumber: Joi.string().empty('').optional(null),
    email: Joi.string().required().email(),
});
exports.createAddressSchema = Joi.object({
    streetName: Joi.string().required().min(1).max(100),
    postalCode: Joi.string().required().min(1).max(12),
    doorNumber: Joi.string().required().min(1).max(10),
    email: Joi.string().email().required(),
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
})
exports.createFriendsRequestSchema = Joi.object({
    fromWho: Joi.string().required().min(1),
    toWhom: Joi.string().required().min(1),
});
exports.acceptFriendsSchema = Joi.object({
    id: Joi.string().required().min(1),
});
