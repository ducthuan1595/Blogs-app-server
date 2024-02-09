import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/auth";
import { UserType } from "../types";

export interface RequestCustom extends Request {
  user?: UserType;
}

const authentication = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {  
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const tokenSecret = process.env.JWT_SECRET;
      if (tokenSecret) {
        const decode = await jwt.verify(token, tokenSecret);
        if(decode && decode.id) {
          const user:UserType = await User.findById(decode.id).select('-password');
          if(user) {
            req.user = user;
            next();
          }
        }else {
          return res.status(403).json({message: 'Unauthorized'})
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: 'Error from server'})
    }
  }else {
    return res.status(400).json({message: 'Not found token'})
  }
};

export default authentication;
