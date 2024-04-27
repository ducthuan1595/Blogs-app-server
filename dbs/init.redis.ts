import { createClient, RedisClientType } from "redis";
import dotenv from 'dotenv';

dotenv.config();

const redisClient: RedisClientType = createClient({
  password: process.env.REDIS_PASSWORD || '',
  socket: {
      host: process.env.REDIS_HOST || '',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 13616
  }
});

const initRedis = async():Promise<void> => {
  redisClient.on("error", (error) => console.error("Error redis" + error));
  await redisClient.connect();
}


export {
  redisClient,
  initRedis
};
