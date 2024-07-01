import { PostType } from "../types";
import { redisClient } from "../dbs/init.redis";

export const getTotalLikedOfBlog = async (posts: PostType[]) => {
    for(let i = 0; i < posts.length; i++) {
        
        let postId = posts[i]._id.toString();
        
        const totalLiked = await redisClient.sCard(postId) as number;
        posts[i].totalLiked = totalLiked;
    }
}

export const insertRedisSearch = async (post:any) => {
    let blogId = `blog:${post._id.toString()}`
    await redisClient.hSet(blogId, 'key_word', post.title);
    await redisClient.hSet(blogId, 'data', JSON.stringify(post));
}
