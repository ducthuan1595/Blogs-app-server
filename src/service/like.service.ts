import { redisClient } from '../dbs/init.redis';
import _Blog from '../model/blog.model';
import { RequestCustom } from '../middleware/auth.middleware';
import { type_notify, type_redis } from '../utils/constant';
import { pushNotifyToSystem } from './notification.service';

const likedService = async (blogId: string, req: RequestCustom) => {
    try{
        if(req.user) {                        
            const blog = await _Blog.findById(blogId);
            if(blog && blog.userId) {
                const isLiked = await redisClient.sIsMember(blogId, JSON.stringify(req.user));
                
                if(isLiked) {
                    await redisClient.sRem(blogId, JSON.stringify(req.user));
                    
                }else {
                    await redisClient.sAdd(blogId, JSON.stringify(req.user));
                    if(req.user._id.toString() !== blog.userId.toString()) {
                        await pushNotifyToSystem({
                            type: type_notify.LIKE_TYPE,
                            receiverId: blog.userId.toString(),
                            senderId: req.user._id,
                            options: {
                                blogId: blogId,
                                date: new Date().getTime(),
                                blogTitle: blog.title,
                                categoryId: blog.categoryId
                            }
                        })
                    }
                }


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

const getLikerService = async(blogId: string) => {
    try{
        const likers = await redisClient.sMembers(blogId);
        if(likers) {
            return {
                message: 'ok',
                code: 200,
                data: likers
            }
        }
    }catch(err) {
        console.error(err);
    }
}

export {
    likedService,
    getLikerService
}