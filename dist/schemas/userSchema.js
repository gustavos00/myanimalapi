"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = exports.createAddressSchema = exports.createUserSchema = void 0;
const Joi = require("joi");
exports.createUserSchema = Joi.object({
    givenName: Joi.string().required().min(1).max(60),
    familyName: Joi.string().required().min(1).max(60),
    email: Joi.string().required().min(1).email(),
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
