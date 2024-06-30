import Joi from 'joi';

const createLikeValidate = (data: any) => {
    const userSchema = Joi.object({
        blogId: Joi.string().required()
    });

    return userSchema.validate(data);
}


export {
    createLikeValidate,
}