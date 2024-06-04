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

// Get similar products by product id
productsRouter.get("/similar/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findById(productId);
    if (!product) {
      throw createError(404, "Không tìm thấy sản phẩm");
    }

    const similarProducts = await Products.find({
      category: product.category, // Lấy sản phẩm cùng danh mục với sản phẩm ban đầu
      _id: { $ne: product._id }, // Loại bỏ sản phẩm ban đầu khỏi kết quả
    })
      .populate("category")
      .exec();

    if (similarProducts.length === 0) {
      throw createError(404, "Không tìm thấy sản phẩm tương tự");
    }

    res.send(similarProducts);
  } catch (error) {
    next(error);
  }
}); // Get new added products
productsRouter.get("/new", async (req, res, next) => {
  try {
    // Lấy 10 sản phẩm mới nhất dựa trên thời gian tạo
    const newAddedProducts = await Products.find({})
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo giảm dần để lấy sản phẩm mới nhất trước
      .limit(1) // Giới hạn số lượng sản phẩm mới nhất
      .populate("category")
      .exec();

    if (newAddedProducts.length === 0) {
      throw createError(404, "Không tìm thấy sản phẩm mới");
    }

    res.send(newAddedProducts);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
