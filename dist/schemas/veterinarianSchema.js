"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVeterinarian = exports.acceptVeterinarian = void 0;
const Joi = require('joi');
exports.acceptVeterinarian = Joi.object({
    veterinarianId: Joi.string().required().min(1),
    animalId: Joi.string().required().min(1),
});
exports.removeVeterinarian = Joi.object({
    animalId: Joi.string().required().min(1),
});
