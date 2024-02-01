import { Response, Request } from "express";
import { getPosts } from "../service/post";

export const getAllPost = async(req: Request, res: Response) => {
  const {page, limit} = req.query;
  if(page && limit) {
    const data = await getPosts(+page, +limit);
    if(data) {
      return res.status(data.status).json({message: data.message, data: data.data})
    }
  }
}