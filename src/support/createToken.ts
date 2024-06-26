import jwt from "jsonwebtoken";

import { redisClient } from "../dbs/init.redis";

async function createToken(id: string) {
  if (process.env.JWT_SECRET_TOKEN) {
    const tokenCounter = await redisClient.get('tokenCouter') as string;
    await redisClient.set("tokenCouter", parseInt(tokenCounter) + 1);
    let key = (parseInt(tokenCounter!) + 1).toString(); 

    const token = jwt.sign({id}, process.env.JWT_SECRET_TOKEN, {
      expiresIn: '300s'
    })
    // save token to redis store
    await redisClient.set(key, token);
    return key;
  }
}

async function createRefreshToken (id: string) {
  if (process.env.JWT_SECRET_REFRESH_TOKEN) {
    const tokenCounter = await redisClient.get('tokenCouter') as string;
    await redisClient.set("tokenCouter", parseInt(tokenCounter) + 1);
    let key = (parseInt(tokenCounter!) + 1).toString(); 

    const token = jwt.sign({id}, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: '30d'
    })
    // save token to redis store
    await redisClient.set(key, token);
    return key;
  }
}

export {
  createToken,
  createRefreshToken,
}
