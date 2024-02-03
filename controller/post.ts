import { Response, Request } from "express";
import {
  getPosts,
  getPostByCategoryService,
  getPostByUserService,
  getPostService,
} from "../service/post";
import { RequestCustom } from "../middleware/authentication";

export const getAllPost = async(req: Request, res: Response) => {
  const {page, limit} = req.query;
  if(page && limit) {
    const data = await getPosts(+page, +limit);
    if(data) {
      return res.status(data.status).json({message: data.message, data: data.data})
    }
  }
}

export const getPostByCategory = async(req: Request, res: Response) => {
  const {categoryId, page, limit} = req.query;
  if(!categoryId || !page || !limit) {
    return res.status(400).json({message: 'Not found'})
  }
  const {status, message, data} = await getPostByCategoryService(+page, +limit, categoryId.toString());
  return res.status(status).json({message, data})
}

export const getPostByUser = async(req:RequestCustom, res:Response) => {
  const {page, limit} = req.query;
  if(req.user && page && limit) {
    const data = await getPostByUserService(+page, +limit ,req.user);
    if(data) {
      return res.status(data.status).json({message: data.message, data: data.data})
    }
  }
}

export const getPost = async(req: Request, res: Response) => {
  const postId = req.query.postId;
  if(!postId) {
    return res.status(404).json({message: 'Not found'})
  }
  const data = await getPostService(postId);
  if(data) {
    return res.status(data.status).json({message: 'ok', data: data})
  }
}
