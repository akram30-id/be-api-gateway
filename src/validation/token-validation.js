import Joi from "joi"

const generateTokenValidation = Joi.object({
    grant_type: Joi.string().max(50).required()
});

const cekTokenValidation = Joi.object({
    action: Joi.string().max(24).required()
});

export {
    generateTokenValidation,
    cekTokenValidation
}