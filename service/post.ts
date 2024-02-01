import Post from '../model/post';
import { pageSection } from '../support/pageSection';
import { PostType } from '../types';

export const getPosts = async(page: number, limit:number) => {
  try{
    console.log('click');
    
    const posts:PostType[] = await Post.find()
      .populate("userId", "-password")
      .populate("categoryId")
      // .sort({updatedAt: -1});

    console.log(posts);
      
    const data = pageSection(page, limit, posts);
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server',
      data: [],
    }
  }
}