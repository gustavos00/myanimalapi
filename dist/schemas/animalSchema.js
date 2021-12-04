"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMyAnimalSchema = exports.updateAnimalSchema = exports.deleteAnimalSchema = exports.createAnimalSchema = void 0;
const Joi = require('joi');
exports.createAnimalSchema = Joi.object({
    name: Joi.string().required().max(250),
    age: Joi.string().max(5),
    breed: Joi.string().required().max(250),
    birthday: Joi.string().max(2),
    birthdayMonth: Joi.string().max(2),
    trackNumber: Joi.string().max(50),
    token: Joi.string().required(),
});
exports.deleteAnimalSchema = Joi.object({
    id: Joi.string().required(),
});
exports.updateAnimalSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required().max(250),
    age: Joi.string().max(5),
    breed: Joi.string().required().max(250),
    birthday: Joi.string().max(2),
    birthdayMonth: Joi.string().max(2),
    trackNumber: Joi.string().max(50),
    token: Joi.string().required(),
});
exports.findMyAnimalSchema = Joi.object({
    trackNumber: Joi.string().required(),
});
