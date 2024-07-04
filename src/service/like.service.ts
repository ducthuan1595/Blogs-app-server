import { redisClient } from '../dbs/init.redis';
import _Blog from '../model/blog.model';
import { RequestCustom } from '../middleware/auth.middleware';
import { type_redis } from '../utils/constant';

const likedService = async (blogId: string, req: RequestCustom) => {
    try{
        if(req.user) {                        
            const blog = await _Blog.findById(blogId);
            if(blog) {
                const isLiked = await redisClient.sIsMember(blogId, JSON.stringify(req.user));
                
                if(isLiked) {
                    await redisClient.sRem(blogId, JSON.stringify(req.user));
                    
                }else {
                    await redisClient.sAdd(blogId, JSON.stringify(req.user));
                }

                await redisClient.zIncrBy(type_redis.BEST_LIST_BLOG, 1, JSON.stringify(blog))
                return {
                    code: 201,
                    message: 'ok',
                    data: await redisClient.sCard(blogId)
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
    likedService,
}