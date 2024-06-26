import Joi from 'joi';

const verifyOtpValidate = (data: any) => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        otp: Joi.string().min(6).required()
    });

    return userSchema.validate(data);
}

const sendAgainOtpValidate = (data: any) => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        username: Joi.string().min(2).required()
    });

    return userSchema.validate(data);
}

export {
    verifyOtpValidate,
    sendAgainOtpValidate
}