import { Response, Request } from "express";
import {
  getPosts,
  getPostByCategoryService,
  getPostByUserService,
  getPostService,
  updatePostService,
  createPostService,
  deletePostService,
  searchPostService,
} from "../service/blog.service";
import { RequestCustom } from "../middleware/auth.middleware";
import { PostType } from "../types";

export const getAllPost = async(req: Request, res: Response) => {
  
  const {page = 1, limit = 4} = req.query;
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
  const {page = 1, limit = 4} = req.query;
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
  const data = await getPostService(postId.toString());
  if(data) {
    return res.status(data.status).json({message: data.message, data: data.data})
  }
}

export const updatePost = async (req: RequestCustom, res: Response) => {
  const request = req.body;
  if(!request.postId || !request.desc || !request.title || !request.categoryId || !req.user) {
    return res.status(404).json({message: 'Not found'})
  }

  const data = await updatePostService(request, req.user);
  if(data) {
    return res.status(data.status).json({message: data.message})
  }
};

export const createPost = async(req: RequestCustom, res: Response) => {
  const request = req.body;
  if (
    !request.desc ||
    !request.title ||
    !request.categoryId ||
    !request.image ||
    !req.user
  ) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await createPostService(request, req.user);
  if (data) {
    return res.status(data.status).json({ message: data.message });
  }
}

export const deletePost = async(req: RequestCustom, res: Response) => {
  const postId = req.query.postId;
  if(!postId || !req.user) {
    return res.status(404).json({message: 'Not found'})
  }
  const data = await deletePostService(postId.toString(), req.user);
  if(data) {
    return res.status(data.status).json({message: data.message})
  }
}

export const searchPost = async (req: Request, res: Response) => {
  const search = req.query.search;
  if(!search) {
    return res.status(400).json({message: 'Not found'})
  }
  const data = await searchPostService(search.toString());
  if(data) {
    return res.status(data.status).json({message: data.message, data: data.data})
  }
}
