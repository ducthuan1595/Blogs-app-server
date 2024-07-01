import _Blog from '../model/blog.model';
import _Category from '../model/categories.model';
import _Permission from '../model/permission.model';
import { pageSection } from '../support/pageSection';
import { ImageType, PostType, UserType } from '../types';
import { destroyClodinary } from './cloudinary';
import { redisClient } from '../dbs/init.redis';
import { getTotalLikedOfBlog, insertRedisSearch } from '../utils/redis';

interface RequestPostType {
  title: string;
  desc: string;
  blogId?: string;
  image: ImageType[];
  categoryId: string;
}

export const getPosts = async(page: number, limit:number) => {
  try{
    
    await _Category.find();
    const posts:PostType[] = await _Blog.find()
      .populate("userId", "-password")
      .populate("categoryId")
      .sort({updatedAt: -1})
      .lean()
    
    await getTotalLikedOfBlog(posts);

    const data = pageSection(page, limit, posts)

    return {
    code: 201,
    message: "ok",
    data: {
        posts: data.result,
        meta: {
            totalPage: data.totalPage,
            nextPage: page * limit < posts.length,
            prevPage: 0 < page - 1,
            totalPosts: posts.length,
            currPage: page,
        }
    },
    };
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server',
      data: [],
    }
  }
}

export const getPostByCategoryService = async(page:number, limit: number, categoryId: string) => {
  try{
    const posts: PostType[] = await _Blog.find({categoryId})
    .populate('userId', '-password')
    .populate('categoryId')
    .sort({updatedAt: -1})
    .lean();

    await getTotalLikedOfBlog(posts);
    
    const data = pageSection(page, limit, posts)
    return {
      code: 201,
      message: "ok",
      data: {
        posts: data.result,
        meta: {
            totalPage: data.totalPage,
            nextPage: page * limit < posts.length,
            prevPage: 0 < page - 1,
            totalPosts: posts.length,
            currPage: page,
        }
      },
    };
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const getPostByUserService = async (page: number, limit: number ,user: UserType) => {
  try{
    const posts: PostType[] = await _Blog.find({userId: user._id}).sort({updatedAt: -1}).lean();
    
    await getTotalLikedOfBlog(posts);
    const data = pageSection(page, limit, posts);
    return {
      code: 201,
      message: "ok",
      data: {
        posts: data.result,
        meta: {
            totalPage: data.totalPage,
            nextPage: page * limit < posts.length,
            prevPage: 0 < page - 1,
            totalPosts: posts.length,
            currPage: page,
        }
      },
    };
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const getPostService = async(postId: string) => {
  try{
    const post: PostType | null = await _Blog.findById(postId).populate('categoryId').populate('userId', '-password').lean();
    if(post) {
        post.totalLiked = await redisClient.sCard(postId) as number;
        return {
          code: 201,
          message: 'ok',
          data: post
        }
    }
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const updatePostService = async (request: RequestPostType, user: UserType) => {
  try {
    const post: PostType | null | undefined = await _Blog.findById(request.blogId);
    if (post && post.userId?.toString() === user._id.toString()) {
        post.title = request.title;
        post.desc = request.desc;
        post.categoryId = request.categoryId;
        if(request.image && request.image.length) {
            for(let img of post.image) {
            if(img && img.public_id) {
                await destroyClodinary(img.public_id);
            }
            }
            post.image = request.image;
        }
      await (post as any).save();
      await insertRedisSearch(post);

      return {
        code: 201,
        message: "ok",
      };
    }
  } catch (err) {
    console.error(err);
    
    return {
      code: 500,
      message: "Error from server",
    };
  }
};

export const createPostService = async(request: RequestPostType, user: UserType) => {
  try{
    const post = await _Blog.create({
      title: request.title,
      desc: request.desc,
      userId: user._id,
      // image: request.image,
      categoryId: request.categoryId,
    });
    
    if(post) {
      await insertRedisSearch(post);
  
      return {
        code: 200,
        message: 'ok',
        data: post
      }
    }
  }catch(err) {
    console.log('Error:::', err);
    
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const deletePostService = async(postId: string, user: UserType) => {
  try{
    // const posts = await Post.deleteOne({_id: postId, userId: user._id});
    const post = await _Blog.findById(postId);
    const permit = await _Permission.findOne({userId: user._id});
    
    if(post && permit && (post.userId?.toString() === user._id.toString() || permit.admin)) {
        for(let img of post.image) {
            if(img && img.public_id) {
            await destroyClodinary(img.public_id);
            }
        }
        await _Blog.findByIdAndDelete(postId)
        return {
            code: 200,
            message: 'ok'
        }
    }else {
        return{
            code: 403,
            message: 'Unauthorized'
        }
    }
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const searchPostService = async (keyword: string) => {
  try{
    // const keyword = search ? {
    //   $or: [
    //     {
    //       title: {
    //         $regex: search,
    //         $options: 'i'
    //       }
    //     }
    //   ]
    // } : {};

    // const posts = await _Blog.find(keyword).populate('userId', '-password').populate('categoryId').limit(10).lean();
    const result = await redisClient.ft.search('blog_index', `%${keyword}%`)
  
    if(result) {
      return {
        code: 201,
        message: 'ok',
        data: result
      }
    }
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}