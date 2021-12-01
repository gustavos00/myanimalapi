const Joi = require('joi');

export const createAnimalSchema = Joi.object({
  name: Joi.string().required().max(250),
  age: Joi.string().max(5),
  breed: Joi.string().required().max(250),
  birthday: Joi.string().max(2),
  birthdayMonth: Joi.string().max(2),
  trackNumber: Joi.string().max(50),

  token: Joi.string().required(),
});

export const deleteAnimalSchema = Joi.object({
  id: Joi.number().required(),
});
