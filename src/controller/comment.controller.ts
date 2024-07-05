import { Request, Response } from 'express';

import { createCommentService, getCommentsByParentId, deleteCommentService, getLengthCommentByBlog } from '../service/comment.service';
import { createCommentValidate, deleteCommentValidate } from '../support/validation/comment.validate';

const createComment = async (req: Request, res: Response) => {
    try {
        const {
            blogId,
            userId,
            content,
            parentCommentId = null,
        } = req.body;
        
        console.log('body comment' ,typeof req.body.parentCommentId);

        const {error} = createCommentValidate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message, code: 400});
        }
        const data = await createCommentService({blogId, userId, content, parentCommentId});
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code, data: data?.data})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const getComments = async(req: Request, res: Response) => {
    try{ 
        const {
            blogId,
            parentCommentId = null,
            limit = 50,
            offset = 1
        } = req.query;
        if(!blogId) {
            return res.status(400).json({message: 'Not found blog', code: 400})
        }
        console.log(limit);
        const data = await getCommentsByParentId(blogId.toString(), parentCommentId?.toString(), +limit, +offset);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code, data: data?.data})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const deleteComment = async(req: Request, res: Response) => {
    try{
        const {
            blogId,
            commentId,
        } = req.body;
        const {error} = deleteCommentValidate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message, code: 400})
        }

        const data = await deleteCommentService(blogId, commentId, req);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const getLengthComment = async(req: Request, res: Response) => {
    const {blogId} = req.query;
    if(!blogId) {
        return res.status(404).json({message: 'Not found blog', code: 404})
    }
    const data = await getLengthCommentByBlog(blogId.toString());
    if(data) {
        res.status(data.code).json({message: data.message, data: data.data})
    }
}

export {
    createComment,
    getComments,
    deleteComment,
    getLengthComment
}