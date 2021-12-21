const Joi = require("joi");

export const createUserSchema = Joi.object({
  givenName: Joi.string().required().min(1).max(60),
  familyName: Joi.string().required().min(1).max(60),
  email: Joi.string().required().min(1).email(),
});

export const createAddressSchema = Joi.object({
  streetName: Joi.string().required().min(1).max(100),
  postalCode: Joi.string().required().min(1).max(12),
  doorNumber: Joi.string().required().min(1).max(10),
})

export const statusSchema = Joi.object({
  status: Joi.string().required().min(1).max(100),
})