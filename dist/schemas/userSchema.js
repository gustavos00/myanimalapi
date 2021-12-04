"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const Joi = require("joi");
exports.createUserSchema = Joi.object({
    givenName: Joi.string().required().max(60),
    familyName: Joi.string().required().max(60),
    email: Joi.string().required().email(),
});
