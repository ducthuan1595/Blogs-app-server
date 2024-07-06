import { PostType } from "../types";
import { redisClient } from "../dbs/init.redis";
import { type_redis } from "./constant";

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

export const insertRedisListBlog = async (post: any) => {
    let postId = post._id.toString();
    const totalLiked = await redisClient.sCard(postId) as number;
    await redisClient.zAdd(type_redis.BEST_LIST_BLOG, [{ score: totalLiked, value: JSON.stringify(post)}])
}

export const fieldsSetBlog = (post: PostType) => {
    const dataset = {
        title: post.title,
        desc: post.desc,
        userId: post.userId,
        image: post.image,
        categoryId: post.categoryId,
        _id: post._id
    }
    return dataset;
}