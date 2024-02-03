import Category from "../model/category";
import { CategoryType, ImageType, UserType } from "../types";

export const getCategoryService = async () => {
  try{
    const categories = await Category.find();
    return {
      status: 201,
      message: 'ok',
      data: categories
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const editCategory = async(categoryId: string, name:string, image: ImageType | undefined, slogan:string, user: UserType) => {
  try{
    if(user?.role !== 'F2') {
      return {
        status: 403,
        message: 'Unauthorized'
      }
    }
    const category = await Category.findById(categoryId);
    if(category) {
      category.name = name;
      category.slogan = slogan;
      if(image) {
        category.image = image;
      }
      const updated = await category.save();
      return {
        status: 201,
        message: "ok",
        data: updated,
      };
    }

  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}