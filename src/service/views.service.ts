import { redisClient } from '../dbs/init.redis';
import _Blog from '../model/blog.model';

const viewBlogService = async(blogId: string, getIPUser: string) => {
    try{
        const viewId = `view:${blogId}`;
        const userId = `userIP:${getIPUser}`;
        const isOk = await redisClient.set(userId, 'hits', {NX: true, EX: 180});
        
        if(isOk) {
            await redisClient.incrBy(viewId, 1)
            return {
                message: 'ok',
                code: 200
            }
        }
        return {
            message: 'Error',
            code: 200
        }
    }catch(err) {
        console.error(err);
    }
}

const getViewBlogService = async(blogId: string) => {
    try{
        const viewId = `view:${blogId}`;
        const totalView = await redisClient.get(viewId)
        return {
            message: 'ok',
            code: 200,
            data: totalView ? +totalView : 0
        }
    }catch(err) {
        console.error(err);
        
    }
}

export {
    viewBlogService,
    getViewBlogService
}