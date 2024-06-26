import Joi from 'joi';

const signUpValidate = (data: any) => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).max(32).required(),
        username: Joi.string().min(2).required()
    });

    return userSchema.validate(data);
}

const loginValidate = (data: any) => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).max(32).required(),
    });

    return userSchema.validate(data);
}

export {
    signUpValidate,
    loginValidate
}