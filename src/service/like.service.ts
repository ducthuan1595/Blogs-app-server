import { isReadable } from 'stream';
import { redisClient } from '../dbs/init.redis';
import { RequestCustom } from '../middleware/auth.middleware';

const createLikedService = async (blogId: string, req: RequestCustom) => {
    try{
        if(req.user) {            
            
            const isLike = await redisClient.sAdd(Object.values(blogId)[0], req.user._id.toString());

            if(isLike) {
                return {
                    code: 201,
                    message: 'ok',
                    data: await redisClient.sCard(Object.values(blogId)[0])
                }
            }
            return {
                code: 400,
                message: 'Not found blog'
            }
        }

    }catch(err) {
        console.error(err);   
    };
}

const removeLikedService = async (blogId: string, req: RequestCustom) => {
    try{
        if(req.user) {            
            
            const iSRemove = await redisClient.sRem(Object.values(blogId)[0], req.user._id.toString());
            if(iSRemove) {
                return {
                    code: 201,
                    message: 'ok',
                    data: await redisClient.sCard(Object.values(blogId)[0])
                }
            }
            return {
                code: 400,
                message: 'Not found blog'
            }
        }

    }catch(err) {
        console.error(err);   
    };
}

export {
    createLikedService,
    removeLikedService
}