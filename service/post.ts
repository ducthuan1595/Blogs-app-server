import Post from '../model/post';
import Category from '../model/category';
import { pageSection } from '../support/pageSection';
import { PostType, UserType } from '../types';

export const getPosts = async(page: number, limit:number) => {
  try{
    await Category.find();
    const posts:PostType[] = await Post.find()
      .populate("userId", "-password")
      .populate("categoryId")
      .sort({updatedAt: -1})
      .lean()
          
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
      message: 'Error from server',
      data: [],
    }
  }
}

export const getPostByCategoryService = async(page:number, limit: number, categoryId: string) => {
  try{
    const posts: PostType[] = await Post.find({categoryId}).sort({updatedAt: -1}).lean();
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
    const post = await Post.findById(postId);
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