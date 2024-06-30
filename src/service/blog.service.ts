import Post from '../model/blog.model';
import Category from '../model/categories.model';
import { pageSection } from '../support/pageSection';
import { ImageType, PostType, UserType } from '../types';
import { destroyClodinary } from './cloudinary';

interface RequestPostType {
  title: string;
  desc: string;
  postId?: string;
  image: ImageType[];
  categoryId: string;
}

export const getPosts = async(page: number, limit:number) => {
  try{
    
    await Category.find();
    const posts:PostType[] = await Post.find()
      .populate("userId", "-password")
      .populate("categoryId")
      .sort({updatedAt: -1})
      .lean()
          
    
    const data = pageSection(page, limit, posts);
    const result = {
      posts: data.result,
      totalPage: data.totalPage,
      nextPage: page * limit < posts.length,
      prevPage: 0 < page - 1,
      totalPosts: posts.length,
      currPage: page,
    };
    return {
      status: 201,
      message: "ok",
      data: result,
    };
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server',
      data: [],
    }
  }
}

export const getPostByCategoryService = async(page:number, limit: number, categoryId: string) => {
  try{
    const posts: PostType[] = await Post.find({categoryId}).populate('userId', '-password').populate('categoryId').sort({updatedAt: -1}).lean();
    const data = pageSection(page, limit, posts)
    return {
      status: 201,
      message: "ok",
      data: {
        posts: data.result,
        totalPage: data.totalPage,
        nextPage: page * limit < posts.length,
        prevPage: 0 < page - 1,
        totalPosts: posts.length,
        currPage: page,
      },
    };
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const getPostByUserService = async (page: number, limit: number ,user: UserType) => {
  try{
    const posts: PostType[] = await Post.find({userId: user._id}).sort({updatedAt: -1}).lean()
    const data = pageSection(page, limit, posts);
    return {
      status: 201,
      message: "ok",
      data: {
        posts: data.result,
        totalPage: data.totalPage,
        nextPage: page * limit < posts.length,
        prevPage: 0 < page - 1,
        totalPosts: posts.length,
        currPage: page,
      },
    };
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const getPostService = async(postId: string) => {
  try{
    const post = await Post.findById(postId).populate('categoryId').populate('userId', '-password');
    return {
      status: 201,
      message: 'ok',
      data: post
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const updatePostService = async (request: RequestPostType, user: UserType) => {
  try {
    const post: PostType | null | undefined = await Post.findById(request.postId);
    if (post && post.userId?.toString() === user._id.toString()) {
      post.title = request.title;
      post.description = request.desc;
      post.categoryId = request.categoryId;
      if(request.image.length) {
        for(let img of post.image) {
          if(img && img.public_id) {
            await destroyClodinary(img.public_id);
          }
        }
        post.image = request.image;
      }
      await (post as any).save();
      return {
        status: 201,
        message: "ok",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: "Error from server",
    };
  }
};

export const createPostService = async(request: RequestPostType, user: UserType) => {
  try{
    const post = new Post({
      title: request.title,
      desc: request.desc,
      userId: user._id,
      image: request.image,
      categoryId: request.categoryId,
    });
    await post.save();
    return {
      status: 200,
      message: 'ok'
    }
  }catch(err) {
    console.log('Error:::', err);
    
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const deletePostService = async(postId: string, user: UserType) => {
  try{
    // const posts = await Post.deleteOne({_id: postId, userId: user._id});
    const post = await Post.findById(postId);
    if(post && (post.userId?.toString() === user._id.toString() || user.role === 'F2')) {
      for(let img of post.image) {
        if(img && img.public_id) {
          await destroyClodinary(img.public_id);
        }
      }
      await Post.findByIdAndDelete(postId)
      return {
        status: 200,
        message: 'ok'
      }
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const searchPostService = async (search: string) => {
  try{
    const keyword = search ? {
      $or: [
        {
          title: {
            $regex: search,
            $options: 'i'
          }
        }
      ]
    } : {};
    const posts = await Post.find(keyword).populate('userId', '-password').populate('categoryId').limit(10).lean();
  
    if(posts) {
      return {
        status: 201,
        message: 'ok',
        data: posts
      }
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}