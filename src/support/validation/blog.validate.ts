import Joi from 'joi';

const updateBlogValidate = (data: any) => {
    const userSchema = Joi.object({
        postId: Joi.string().required(),
        title: Joi.string().required(),
        categoryId: Joi.string().required(),
        desc: Joi.string().required(),
        image: Joi.object()
    });

    return userSchema.validate(data);
}


export {
    updateBlogValidate,
}