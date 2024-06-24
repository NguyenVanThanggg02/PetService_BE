import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js"; // npm install crypto-js
import moment from "moment"; // npm install moment
import qs from "qs";
import Order from "../models/order.js";
import { orderController } from "../controllers/index.js";
import OrderItem from "../models/orderItem.js";
import Cart from "../models/cart.js";

const orderRouter = express.Router();

orderRouter.get("/", orderController.getAllOrder);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.get("/user/:id", orderController.getListOrderOfUser);
orderRouter.get("/:id", orderController.getOrderById);

orderRouter.post("/", async (req, res) => {
  const { paymentMethod, listCart, profile } = req.body;

  // Function to calculate the total amount of the order
  const calculateTotal = (listCart) => {
    return listCart.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  if (paymentMethod === "COD") {
    try {
      // Save order items and collect their IDs
      const orderItems = await Promise.all(
        listCart.map(async (item) => {
          const orderItem = new OrderItem({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          });
          await orderItem.save();
          return orderItem._id;
        })
      );

      // Create and save the order
      const order = new Order({
        userId: profile,
        items: orderItems,
        totalAmount: calculateTotal(listCart),
        paymentMethod: paymentMethod,
        status: "Pending", // đặt trạng thái mặc định là pending khi đặt hàng xong
      });

      const savedOrder = await order.save();

      // xoá sản phẩm trong giỏ hàng khi đã đặt hàng
      await Cart.deleteMany({ userId: profile });

      return res.status(200).json({
        message: "Đặt hàng thành công",
        order: savedOrder,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "Error saving the order to the database" });
    }
  }
  //  else if (paymentMethod === "zalopay") {
  //   const embed_data = {
  //     redirecturl: "http://localhost:3000/",
  //   };

  //   const items = listCart.map((item) => ({
  //     name: item.productId.name,
  //     price: item.productId.price,
  //     quantity: item.quantity,
  //   }));

  //   const transID = Math.floor(Math.random() * 1000000);
  //   const order = {
  //     app_id: config.app_id,
  //     app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
  //     app_user: profile.username,
  //     app_time: Date.now(),
  //     item: JSON.stringify(items),
  //     embed_data: JSON.stringify(embed_data),
  //     amount: calculateTotal(listCart),
  //     description: `Thanh toán cho đơn hàng #${transID}`,
  //     bank_code: "",
  //     callback_url: "https://f272-27-73-111-47.ngrok-free.app/callback",
  //   };

  //   const data =
  //     config.app_id +
  //     "|" +
  //     order.app_trans_id +
  //     "|" +
  //     order.app_user +
  //     "|" +
  //     order.amount +
  //     "|" +
  //     order.app_time +
  //     "|" +
  //     order.embed_data +
  //     "|" +
  //     order.item;
  //   order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  //   try {
  //     const result = await axios.post(config.endpoint, null, { params: order });

  //     return res.status(200).json(result.data);
  //   } catch (error) {
  //     console.log(error.message);
  //     return res
  //       .status(500)
  //       .json({ message: "Lỗi khi tạo đơn hàng qua ZaloPay" });
  //   }
  // } 
  else {
    return res
      .status(400)
      .json({ message: "Phương thức thanh toán không hợp lệ" });
  }
});

export default orderRouter;
