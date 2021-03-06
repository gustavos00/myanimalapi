const Joi = require('joi');

export const LoginUserSchema = Joi.object({
  givenName: Joi.string().required().min(1).max(60),
  familyName: Joi.string().required().min(1).max(60),
  email: Joi.string().required().min(1).email(),
  salt: Joi.string().required().min(1),
  isVeterinarian: Joi.boolean().required(),
});

export const UpdateUserSchema = Joi.object({
  id: Joi.string().required().min(1),

  idAddress: Joi.string(),
  parishName: Joi.string().min(1).max(100),
  locationName: Joi.string().min(1).max(100),
  streetName: Joi.string().min(1).max(100),
  postalCode: Joi.string().min(1).max(12),
  doorNumber: Joi.string().min(1).max(10),

  givenName: Joi.string().required(),
  familyName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().empty('').optional(null),
  isVeterinarian: Joi.boolean().required(),
});

export const createAddressSchema = Joi.object({               
  parishName: Joi.string().required().min(1).max(100),
  locationName: Joi.string().required().min(1).max(100),
  streetName: Joi.string().required().min(1).max(100),
  postalCode: Joi.string().required().min(1).max(12),
  doorNumber: Joi.string().required().min(1).max(10),
  email: Joi.string().email().required(),
  isVeterinarian: Joi.boolean().required(),
});

export const statusSchema = Joi.object({
  status: Joi.string().required().min(1).max(100),
});

export const generateTokenSchema = Joi.object({
  email: Joi.string().required().email(),
  id: Joi.string().required().min(1),
});

export const verifyTokenSchema = Joi.object({
  token: Joi.string().required().min(1),
  fromWho: Joi.string().required().min(1),
});

export const verifyAccessTokenSchema = Joi.object({
  token: Joi.string().required().min(1),
  salt: Joi.string().required().min(1),
});

export const getAllFriendsDataSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const storeExpoTokenSchema = Joi.object({
  expoToken: Joi.string().required().min(1),
  token: Joi.string().required().min(1),
});

export const acceptFriendsSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const declineFriendsSchema = Joi.object({
  id: Joi.string().required().min(1),
});

export const deleteFriendSchema = Joi.object({
  id: Joi.string().required().min(1)
})