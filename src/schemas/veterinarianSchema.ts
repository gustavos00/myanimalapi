const Joi = require('joi');

export const acceptVeterinarian = Joi.object({
  veterinarianId: Joi.string().required().min(1),
  animalId: Joi.string().required().min(1),
});

export const removeVeterinarian = Joi.object({
  animalId: Joi.string().required().min(1),
});

export const getVeterinarianAnimalsSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const deleteEventSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const getAllEvents = Joi.object({
  id: Joi.string().required().min(1),
});

export const updateEvent = Joi.object({
  idEvents: Joi.number(),
  report: Joi.string().allow(null).allow(''),
  eventsStatusId: Joi.string(),
  eventsTypesId: Joi.string(),
  animalId: Joi.string(),
  date: Joi.string(),
});

export const createEvent = Joi.object({
  date: Joi.string(),
  report: Joi.string().allow(null).allow(''),
  eventsStatusId: Joi.string(),
  eventsTypesId: Joi.string(),
  animalId: Joi.string(),
  files: Joi.any()
});

export const getNotAcceptedOwnersSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const updateVeterinarianStatus = Joi.object({
  id: Joi.string().required().min(1),
});
