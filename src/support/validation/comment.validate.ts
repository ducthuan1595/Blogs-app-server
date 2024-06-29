import Joi from 'joi';

const createCommentValidate = (data: any) => {
    const commentSchema = Joi.object({
        blogId: Joi.string().required(),
        userId: Joi.string().required(),
        content: Joi.string().min(1).required(),
        parentCommentId: Joi.string()
    });

    return commentSchema.validate(data);
}

const deleteCommentValidate = (data: any) => {
    const commentSchema = Joi.object({
        blogId: Joi.string().required(),
        commentId: Joi.string().required(),
    });

    return commentSchema.validate(data);
}

export {
    createCommentValidate,
    deleteCommentValidate
}