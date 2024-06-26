import { redisClient } from '../dbs/init.redis';

const incr = (key: string): Promise<number> => {
    return new Promise(async(resolve, reject) => {
        const num = await redisClient.incr(key);
        resolve(num)
    })
}

const expired = (key: string, time: number) => {
    return new Promise(async(resolve, reject) => {
        const result = await redisClient.expire(key, time);
        resolve(result);
    })
}

const ttl = (key: string) => {
    return new Promise(async(resolve, reject) => {
        const result = await redisClient.ttl(key);
        resolve(result);
    })
}

export {
    incr,
    expired,
    ttl
}