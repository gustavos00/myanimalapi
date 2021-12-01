const Joi = require("joi");

export const createUserSchema = Joi.object({
  givenName: Joi.string().required().max(60),
  familyName: Joi.string().required().max(60),
  email: Joi.string().required().email(),
});
