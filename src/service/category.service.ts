import { redisClient } from "../dbs/init.redis";
import _Category from "../model/categories.model";
import _Permission from '../model/permission.model';
import { CategoryType, ImageType, UserType } from "../types";
import { destroyClodinary } from "./cloudinary";

export const getCategoryService = async () => {
  try{
    const categories: CategoryType[] = await _Category.find().lean();

    return {
      code: 201,
      message: 'ok',
      data: categories
    }
  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const editCategory = async(categoryId: string, name:string, image: ImageType | null, slogan:string, user: UserType) => {
  try{
    const permit = await _Permission.findOne({userId: user._id});
    if(!permit || (!permit.admin && !permit.moderator)) {
      return {
        code: 403,
        message: 'Unauthorized'
      }
    }
    const category = await _Category.findById(categoryId);
    if(category) {
      category.name = name;
      category.slogan = slogan;
      if(image) {
        if(category.image?.public_id) {
          await destroyClodinary(category.image?.public_id)
        }
        category.image = image;
      }
      const updated = await category.save();
      return {
        code: 201,
        message: "ok",
        data: updated,
      };
    }

  }catch(err) {
    return {
      code: 500,
      message: 'Error from server'
    }
  }
}

export const createCategoryService = async (name: string, slogan: string, image: ImageType, user: UserType) => {
  try {
    console.log(user);
    
    const permit = await _Permission.findOne({userId: user._id});
    if(!permit || (!permit.admin && !permit.moderator)) {
      return {
        code: 403,
        message: 'Unauthorized!'
      }
    }
    const category = new _Category({
      name,
      slogan,
      image,
    })
    const newCategory = await category.save();
    return {
      code: 200,
      message: "ok",
      data: newCategory,
    };
  } catch (err) {
    return {
      code: 500,
      message: "Error from server",
    };
  }
};

export const deleteCategoryService = async (
  categoryId: string,
  user: UserType
) => {
  try {
    const category = await _Category.findById(categoryId);
    const permit = await _Permission.findOne({userId: user._id});
    if (!category || !permit || (!permit.admin && !permit.moderator)) {
      return {
        code: 302,
        message: "Unauthorized",
      };
    }
    if(category.image?.public_id) {
      await destroyClodinary(category.image?.public_id)
    }
    await _Category.findByIdAndDelete(categoryId);
    return {
      code: 200,
      message: 'ok'
    }
  } catch (err) {
    return {
      code: 500,
      message: "Error from server",
    };
  }
};