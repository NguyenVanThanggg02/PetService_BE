import express from "express";
import createError from "http-errors";
import Products from "../models/products.js";

const productsRouter = express.Router();

// Get all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await Products.find({}).populate("category").exec();
    if (products.length === 0) {
      throw createError(404, "Không tìm thấy sản phẩm");
    }
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// Get product by id
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id)
      .populate("category")
      .exec();
    if (!product) {
      throw createError(404, "Không tìm thấy sản phẩm");
    }
    res.send(product);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
