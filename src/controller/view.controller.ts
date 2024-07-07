import { Request, Response } from "express"
import { getViewBlogService, viewBlogService } from "../service/views.service";

const viewBlog = async(req: Request, res: Response) => {
    try{
        const {blogId} = req.body;
        const IPUser = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;
        
        if(!blogId) {
            throw Error('Not found blog')
        };
        const data = await viewBlogService(blogId, IPUser);
        
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code})
        }
    }catch(err) {
        console.log(err);
        
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const getTotalView = async(req: Request, res: Response) => {
    try{
        const {blogId} = req.query;
        if(!blogId) {
            return res.status(404).json({message: 'Not found', code: 404})
        }
        const data = await getViewBlogService(blogId.toString());
        if(data) {
            res.status(data.code).json({message: data.message, data: data.data, code: data.code})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

export {
    viewBlog,
    getTotalView
}