import express from "express";
import createError from "http-errors";
import Category from "../models/category.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const category = await Category.find({}).exec();
    if (category.length === 0) {
      throw createError(404, "Không tìm thấy sản phẩm");
    }
    res.send(category);
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;