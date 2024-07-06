import { Request, Response } from 'express';

import {
  editCategory,
  getCategoryService,
  createCategoryService,
  deleteCategoryService,
} from "../service/category.service";
import dotenv from 'dotenv'
import { RequestCustom } from '../middleware/auth.middleware';
dotenv.config();

export const getCategories = async(req: Request, res: Response) => {
  const {code, message, data} = await getCategoryService();
  res.status(code).json({message, data});
}

export const updateCategory = async(req: RequestCustom, res: Response) => {
  let {categoryId, name, image , slogan} = req.body;
  if(!image || !image.url || !image.public_id) {
    image = null
  }
  if(!categoryId || !req.user || !slogan || !name) {
    return res.status(400).json({message: 'Not found'})
  }
  const data = await editCategory(categoryId.toString(), name, image, slogan, req.user);
  if(data) {
    return res.status(data.code).json({message: data.message, data: data?.data})
  }
}

export const createCategory = async (req: RequestCustom, res: Response) => {
  const {name, image, slogan} = req.body;
  if(!name || !slogan || image?.length || !req.user) {
    return res.status(400).json({message: 'Not found'})
  }
  const data = await createCategoryService(name, slogan, image, req.user);
  if(data) {
    return res.status(data.code).json({message: data.message, data: data?.data})
  }
}

export const deleteCategory = async (req: RequestCustom, res: Response) => {
  const categoryId = req.query.categoryId;
  if (!categoryId || !req.user) {
    return res.status(400).json({ message: "Not found" });
  }
  const data = await deleteCategoryService(categoryId.toString(), req.user);
  if (data) {
    return res
      .status(data.code)
      .json({ message: data.message });
  }
};