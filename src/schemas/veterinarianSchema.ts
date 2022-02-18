const Joi = require('joi');

export const acceptVeterinarian = Joi.object({
    veterinarianId: Joi.string().required().min(1),
    animalId: Joi.string().required().min(1),
})