import { Request, Response } from 'express';
import { createLikedService, removeLikedService } from '../service/like.service';
import { createLikeValidate } from '../support/validation/like.validate';
import { RequestCustom } from '../middleware/auth.middleware';

const createLike = async (req: RequestCustom, res: Response) => {
    try {
        const blogId = req.body;
        const {error} = createLikeValidate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message, code: 400})
        }
     
            
        const data = await createLikedService(blogId, req);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code,  data: data?.data})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const removeLike = async (req: RequestCustom, res: Response) => {
    try {
        const blogId = req.body;
        const {error} = createLikeValidate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message, code: 400})
        }
        
        const data = await removeLikedService(blogId, req);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code,  data: data?.data})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

export {
    createLike,
    removeLike
}