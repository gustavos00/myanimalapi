import Joi from 'joi'

export const userSchema = Joi.object({
  givenName: Joi.string().required().max(60),
  familyName: Joi.string().required().max(60),
  email: Joi.string().required().email(),
})
