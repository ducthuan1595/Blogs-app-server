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
      return res.status(data.code).json({message: data.message, data: data.data})
    }
  }
}

export const getPostByCategory = async(req: Request, res: Response) => {
  const {categoryId, page = 1, limit = 4} = req.query;
  if(!categoryId) {
    return res.status(400).json({message: 'Not found', code: 400})
  }
  const {code, message, data} = await getPostByCategoryService(+page, +limit, categoryId.toString());
  return res.status(code).json({message, data})
}

export const getPostByUser = async(req:RequestCustom, res:Response) => {
  const {page = 1, limit = 4} = req.query;
  if(req.user) {
    const data = await getPostByUserService(+page, +limit ,req.user);
    if(data) {
      return res.status(data.code).json({message: data.message, data: data.data});
    }
  } else {
    return res.status(403).json({message: 'Unauthorized', code: 403});
  }
}

export const getPost = async(req: Request, res: Response) => {
  const postId = req.query.blogId;  
    
  if(!postId) {
    return res.status(404).json({message: 'Not found', code: 404})
  }
  const data = await getPostService(postId.toString());
  if(data) {
    return res.status(data.code).json({message: data.message, data: data.data, code: data.code})
  }
}

export const updatePost = async (req: RequestCustom, res: Response) => {
  const request = req.body;
  if(!request.blogId || !request.desc || !request.title || !request.categoryId || !req.user) {
    return res.status(404).json({message: 'Not found'})
  }

  const data = await updatePostService(request, req.user);
  if(data) {
    return res.status(data.code).json({message: data.message, code: data.code})
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
    return res.status(data.code).json({ message: data.message, code: data.code });
  }
}

export const deletePost = async(req: RequestCustom, res: Response) => {
  const postId = req.body.blogId;
  
  if(!postId || !req.user) {
    return res.status(404).json({message: 'Not found', code: 403})
  }
  const data = await deletePostService(postId.toString(), req.user);
  if(data) {
    return res.status(data.code).json({message: data.message, code: data.code})
  }
}

export const searchPost = async (req: Request, res: Response) => {
  const keyword = req.query.keyword;
  if(!keyword) {
    return res.status(400).json({message: 'Not found'})
  }
  const data = await searchPostService(keyword.toString());
  if(data) {
    return res.status(data.code).json({message: data.message, data: data.data, code: data.code})
  }
}
