import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js"; // npm install crypto-js
import moment from "moment"; // npm install moment
import qs from "qs";
import Order from "../models/order.js";
import { orderController } from "../controllers/index.js";
import OrderItem from "../models/orderItem.js";
import Cart from "../models/cart.js";
import Products from "../models/products.js";

const orderRouter = express.Router();

orderRouter.get("/", orderController.getAllOrder);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.get("/user/:id", orderController.getListOrderOfUser);

// api lấy 2 sản phẩm có lượt mua nhiều nhất theo quantity
orderRouter.get("/top-products", async (req, res) => {
  try {
    const result = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Lấy thông tin chi tiết của các sản phẩm bán chạy nhất
    const topProducts = await Products.find({
      _id: { $in: result.map(item => item._id) }
    });

    // Gộp thông tin chi tiết với số lượng sản phẩm đã bán 
    const topProductsWithQuantity = topProducts.map(product => ({
      ...product.toObject(), // chuyển từ mongodb về dạng js thông thường
      totalQuantity: result.find(item => item._id.equals(product._id)).totalQuantity
    }));

    // sắp xếp sản phẩm bán nhiều nhất lên đầu 
    topProductsWithQuantity.sort((a, b) => b.totalQuantity - a.totalQuantity);

    return res.status(200).json(topProductsWithQuantity);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error retrieving the top products" });
  }
});

orderRouter.get("/:id", orderController.getOrderById);


const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};


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
      // const orderItems = await Promise.all(
      //   listCart.map(async (item) => {
      //     const orderItem = new OrderItem({
      //       productId: item.productId._id,
      //       quantity: item.quantity,
      //       price: item.productId.price,
      //     });
      //     await orderItem.save();
      //     return orderItem._id;
      //   })
      // );

      const orderItems = await Promise.all(
        listCart.map(async (item) => {
          // Kiểm tra xem sản phẩm đã tồn tại trong cơ sở dữ liệu hay chưa
          const existingProduct = await OrderItem.findOne({ productId: item.productId._id });
      
          if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng của sản phẩm lên
            existingProduct.quantity += item.quantity;
            await existingProduct.save();
            return existingProduct._id;
          } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới sản phẩm
            const orderItem = new OrderItem({
              productId: item.productId._id,
              quantity: item.quantity,
              price: item.productId.price,
            });
            await orderItem.save();
            return orderItem._id;
          }
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
   else if (paymentMethod === "zalopay") {
      const embed_data = {
        redirecturl : 'http://localhost/3000/'
      };

      const items = [{}];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
          app_id: config.app_id,
          app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
          app_user: "user123",
          app_time: Date.now(), // miliseconds
          item: JSON.stringify(items),
          embed_data: JSON.stringify(embed_data),
          amount: 50000,
          description: `Payment for the order #${transID}`,
          bank_code: "",
      };
      
      // appid|app_trans_id|appuser|amount|apptime|embeddata|item
      const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
      
    
          try {
            const  result = await axios.post(config.endpoint, null, { params: order })
            // console.log(result.data)
            return res.status(200).json(result.data)
          } catch (error) {
            console.log(error.message);
          }
  } 
  else {
    return res
      .status(400)
      .json({ message: "Phương thức thanh toán không hợp lệ" });
  }
});

// Xử lý callback từ ZaloPay
orderRouter.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac không khớp";
    } else {
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "Cập nhật trạng thái đơn hàng = thành công với app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "thành công";
    }
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
});



export default orderRouter;
