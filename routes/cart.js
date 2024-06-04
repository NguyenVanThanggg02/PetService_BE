import express from "express";
import createHttpError from "http-errors";
import Cart from "../models/cart.js";

const cartRouter = express.Router();
cartRouter.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: username });

    // Kiểm tra nếu không tìm thấy giỏ hàng
    if (!cart) {
      throw createHttpError(404, "Không tìm thấy giỏ hàng cho người dùng này.");
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
});
cartRouter.get("/", async (req, res, next) => {
  try {
    const cart = await Cart.find({});
    if (!cart) throw createHttpError.NotFound();
    res.send(cart);
  } catch (error) {
    next(error);
  }
});
cartRouter.post("/", async (req, res, next) => {
  try {
    const { user, items } = req.body;

    // Kiểm tra nếu các trường bắt buộc đã được cung cấp
    if (!user || !items || items.length === 0) {
      throw createHttpError(400, "Thiếu thông tin bắt buộc.");
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ user });

    // Nếu không tìm thấy giỏ hàng, tạo mới
    if (!cart) {
      cart = await Cart.create({ user, items: [] });
    }

    // Thêm mặt hàng vào giỏ hàng
    for (const item of items) {
      const { productName, quantity, price, image } = item;
      cart.items.push({ productName, quantity, price, image });
    }
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});
cartRouter.delete(
  "/:username/:itemId",

  async (req, res, next) => {
    try {
      const { username, itemId } = req.params;
      const cart = await Cart.findOneAndUpdate(
        { user: username, "items._id": itemId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );
      if (!cart) {
        throw createHttpError(404, "Item not found in the user's cart.");
      }
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);
export default cartRouter;
