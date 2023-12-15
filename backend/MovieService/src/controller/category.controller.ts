import { Request, Response, NextFunction } from "express";
import CategoryModel from "../data/category/category.data";
import CustomResponse from "../utils/custom.response";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await CategoryModel.create({
      name: req.body.name,
      url: req.body.url,
    });

    if (newCategory) {
      return new CustomResponse(newCategory, "success").created(res);
    }
    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const categories = await CategoryModel.find({ isDeleted: false })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    if (categories.length > 0) {
      return new CustomResponse(categories, "success").success(res);
    }
    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findOne({
      isDeleted: false,
      _id: req.params.categoryId,
    });

    if (!category) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    if (req.body.url) {
      category.url = req.body.url;
    }
    if (req.body.name) {
      category.name = req.body.name;
    }
    await category.save();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findOne({
      isDeleted: false,
      _id: req.params.categoryId,
    });

    if (!category) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    category.isDeleted = true;
    await category.save();
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};
