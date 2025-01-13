import Joi from "joi"

const generateTokenValidation = Joi.object({
    grant_type: Joi.string().max(50).required()
});

export {
    generateTokenValidation
}