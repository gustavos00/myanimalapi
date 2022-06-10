"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVeterinarianStatus = exports.getNotAcceptedOwnersSchema = exports.createEvent = exports.updateEvent = exports.getAllEvents = exports.deleteEventSchema = exports.getVeterinarianAnimalsSchema = exports.removeVeterinarian = exports.acceptVeterinarian = void 0;
const Joi = require('joi');
exports.acceptVeterinarian = Joi.object({
    veterinarianId: Joi.string().required().min(1),
    animalId: Joi.string().required().min(1),
});
exports.removeVeterinarian = Joi.object({
    animalId: Joi.string().required().min(1),
});
exports.getVeterinarianAnimalsSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.deleteEventSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.getAllEvents = Joi.object({
    id: Joi.string().required().min(1),
});
exports.updateEvent = Joi.object({
    idEvents: Joi.number(),
    report: Joi.string().allow(null).allow(''),
    eventsStatusId: Joi.string(),
    eventsTypesId: Joi.string(),
    animalId: Joi.string(),
    date: Joi.string(),
});
exports.createEvent = Joi.object({
    date: Joi.string(),
    report: Joi.string().allow(null).allow(''),
    eventsStatusId: Joi.string(),
    eventsTypesId: Joi.string(),
    animalId: Joi.string(),
    files: Joi.any()
});
exports.getNotAcceptedOwnersSchema = Joi.object({
    id: Joi.string().required().min(1),
});
exports.updateVeterinarianStatus = Joi.object({
    id: Joi.string().required().min(1),
});
