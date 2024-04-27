import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/model.auth";
import { redisClient } from "../dbs/init.redis";
import { UserType } from "../types";

export interface RequestCustom extends Request {
  user?: UserType;
}


const authentication = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {  
  if (!req.cookies.access_token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const tokenId = req.cookies.access_token;
    const token = await redisClient.get(tokenId);
    const tokenSecret = process.env.JWT_SECRET_TOKEN;
    if (tokenSecret && token) {
      
      jwt.verify(token, tokenSecret, async(err, data: any) => {
        if(err) {
          return res.status(401).json({message: 'Token is expired'})
        }
        const user:UserType = await User.findById(data.id).select('-password');
        
        if(user) {
          req.user = user;
          next();
        }
        
      });
      
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Token expired'})
  }
};

export default authentication;
