import Category from "../model/categories.model";
import { CategoryType, ImageType, UserType } from "../types";
import { destroyClodinary } from "../utils/cloudinary";

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
        if(category.image?.public_id) {
          await destroyClodinary(category.image?.public_id)
        }
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

export const createCategoryService = async (name: string, slogan: string, image: ImageType, user: UserType) => {
  try {
    if(user.role !== 'F2') {
      return {
        status: 403,
        message: 'Unauthorized!'
      }
    }
    const category = new Category({
      name,
      slogan,
      image,
    })
    const newCategory = await category.save();
    return {
      status: 200,
      message: "ok",
      data: newCategory,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error from server",
    };
  }
};

export const deleteCategoryService = async (
  categoryId: string,
  user: UserType
) => {
  try {
    const category = await Category.findById(categoryId);

    if (category && user.role !== "F2") {
      if(category.image?.public_id) {
        await destroyClodinary(category.image?.public_id)
      }
      return {
        status: 302,
        message: "Unauthorized",
      };
    }
    await Category.findByIdAndDelete(categoryId);
    return {
      status: 200,
      message: 'ok'
    }
  } catch (err) {
    return {
      status: 500,
      message: "Error from server",
    };
  }
};