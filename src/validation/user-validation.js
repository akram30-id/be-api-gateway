import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(191).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
});

const registerPasswordValidation = Joi.object({
    email: Joi.string().max(20).required(),
    password: Joi.string().min(8).max(16).required(),
    confirm_password: Joi.string().min(8).max(16).required()
});

const loginValidation = Joi.object({
    email: Joi.string().max(20).required(),
    password: Joi.string().min(8).max(16).required()
})

export {
    registerUserValidation,
    registerPasswordValidation,
    loginValidation
}