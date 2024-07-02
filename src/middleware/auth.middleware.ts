import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "../model/user.model";
import { redisClient } from "../dbs/init.redis";
import { UserType } from "../types";

export interface RequestCustom extends Request {
  user?: UserType;
}

interface VerifyTokenResult {
    user: UserType | null;
    // error: any | null;
}

const authentication = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {  
  console.log('check token',req.headers.authorization);
  let tokenId;
  if (!req.cookies.access_token && !req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized', code: 401 });
  }

  if(req.cookies.access_token) {
    tokenId = req.cookies.access_token;
  }
  if(req.headers.authorization) {
    tokenId = req.headers.authorization.split(" ")[1];
  }
  
  try {
    const token = await redisClient.get(tokenId);
    const tokenSecret = process.env.JWT_SECRET_TOKEN;
    
    if (tokenSecret && token) {
      
        const user: VerifyTokenResult = await verifyToken(tokenSecret, token);        
        if(user && user.user == null) {
            return res.status(403).json({message: 'Token expired'})
        }
        req.user = user.user as UserType;
        next();
              
    }else {
        return res.status(404).json({message: 'Not found Token'})
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Token expired'})
  }
};

const verifyToken = async (tokenSecret: string, token: string): Promise<VerifyTokenResult> => {
    try {    
        if (tokenSecret && token) {
            
            const decoded = await new Promise<JwtPayload | null>((resolve, reject) => {
                jwt.verify(token, tokenSecret, (err, data) => {
                    if (err) {
                      
                      reject(err);
                    } else {
                      resolve(data as JwtPayload);
                    }
                });
            });
    
            if (decoded) {
                const user: UserType = await User.findById(decoded.id).populate('roleId', '-userId, -_id').select('-password');
                
                return {user:user || null}
                
            }
        }
    
        return { user: null };
    } catch (err) {
      console.log(err);

      return { user: null };
    }
  };

export {
    authentication,
    verifyToken
};
