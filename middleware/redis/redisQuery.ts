import { Response, Request, NextFunction } from "express";
import redisClient from "../../config/redisClient";
import { GET_ALL_POST } from "./redisType";
import { pageSection } from "../../support/pageSection";

export const getAllPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { page, limit } = req.query;
    if(!page || !limit) {
      return res.status(404).json({message: 'Not found'})
    }
    const data = await redisClient.get(GET_ALL_POST);
    if(data) {
      const posts = JSON.parse(data);
      const result = pageSection(+page, +limit, posts);
      
      return res.status(201).json({
        message: "ok",
        data: {
          posts: result.result,
          totalPage: result.totalPage,
          nextPage: +page * +limit < posts.length,
          prevPage: 0 < +page - 1,
          totalPosts: posts.length,
          currPage: page,
        },
      });
    }
    
    next();
  }catch(err) {
    return res.status(500).json({message: 'Error from server'})
  }
}