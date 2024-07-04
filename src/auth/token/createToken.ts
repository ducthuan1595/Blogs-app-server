import jwt from "jsonwebtoken";
import { Response } from "express";

import { redisClient } from "../../dbs/init.redis";

async function createAccessToken(id: string) {
    
  if (process.env.JWT_SECRET_TOKEN) {
    await redisClient.setNX('tokenCount', '0');
    
    let  tokenCounter = await redisClient.get('tokenCount') as string;
    
    await redisClient.set("tokenCount", parseInt(tokenCounter) + 1);
    let key = (parseInt(tokenCounter!) + 1).toString(); 

    const token = jwt.sign({id}, process.env.JWT_SECRET_TOKEN, {
      expiresIn: '1d'
    })
    // save token to redis store
    await redisClient.set(key, token);
    return key;
  }
}

async function createRefreshToken (id: string) {
  if (process.env.JWT_SECRET_REFRESH_TOKEN) {
      await redisClient.setNX('tokenCount', '0');
    
      let tokenCounter = await redisClient.get('tokenCount') as string;
    
      await redisClient.set("tokenCount", parseInt(tokenCounter) + 1);
      let key = (parseInt(tokenCounter!) + 1).toString(); 

      const token = jwt.sign({id}, process.env.JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: '30d'
      })
      // save token to redis store
      await redisClient.set(key, token);
    
      return key;
  }
}

async function createToken (res:Response, userId:string) {
    try{        
        const refresh_token = await createRefreshToken(userId.toString())
        
        const access_token = await createAccessToken(userId.toString())
    
        res.cookie('access_token', access_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: false,
            //secure: true;
        });
        res.cookie('refresh_token', refresh_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: false,
            //secure: true;
        });

        return {
            access_token,
            refresh_token
        }
    }catch(err) {
        console.error(err);
      
    }
}
export {
    createAccessToken,
    createRefreshToken,
    createToken
}
