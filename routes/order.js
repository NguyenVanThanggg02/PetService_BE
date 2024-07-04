import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js"; // npm install crypto-js
import moment from "moment"; // npm install moment
import qs from "qs";
import Order from "../models/order.js";
import { orderController } from "../controllers/index.js";
import OrderItem from "../models/orderItem.js";
import Cart from "../models/cart.js";
import crypto from "crypto";
import Products from "../models/products.js";

const orderRouter = express.Router();

orderRouter.get("/", orderController.getAllOrder);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.get("/user/:id", orderController.getListOrderOfUser);

const Tokens = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl: "mongodb://localhost:27017/chim",
  refreshToken: "171222000-31032004",
  vnp_TmnCode: "ERACZN7K",
  vnp_HashSecret: "QCSRHTCRITPZHEKTZJGYUAPGMIIXZJBY",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3000",
};

orderRouter.post("/vnpay-return/:id", async (req, res) => {
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];
  vnp_Params = sortObject(vnp_Params);
  let config = Tokens;
  let secretKey = config.vnp_HashSecret;
  let signData = qs.stringify(vnp_Params, { encode: false });

  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    if (req.query.vnp_TransactionStatus == "00") {
      // Order.findByIdAndUpdate(req.params.id, { status: "Transfer" }).then(  // này là của nó
      Order.findByIdAndUpdate(req.params.id, { status: "Pending" }).then(() => {
        res.json({ message: "Orders successfully." });
      });
    } else {
      Order.findByIdAndUpdate(req.params.id, {
        status: "Cancel",
        totalAmount: 0,
      }).then(async () => {
        const order = await Order.findById(req.params.id).populate("items");
        if (order) {
          order.items.forEach(async (item) => {
            const orderItem = await OrderItem.findById(item._id);
            if (orderItem) {
              orderItem.price = 0;
              orderItem.quantity = 0;
              await orderItem.save();
            }
          });
        }
        res.json({ message: "Order canceled successfully." });
      });
    }
  } else {
    res.render("success", { code: "97" });
  }
});

// cập nhật trạng thái đơn hàng

orderRouter.put("/:id", orderController.updateOrderStatus);

orderRouter.post("/pay", async (req, res) => {
  const { paymentMethod, listCart, profile, bankCode, language } = req.body;

  if (!paymentMethod || !listCart || !profile) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create order items

    const orderItems = await Promise.all(
      listCart.map(async (item) => {
        const productId = item.productId._id;
        const quantityToReduce = item.quantity;
        const dbProduct = await Products.findById(productId);
        if (!dbProduct) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        dbProduct.quantity -= quantityToReduce;
        dbProduct.sold += quantityToReduce;
        await dbProduct.save();

        const orderItem = new OrderItem({
          productId: dbProduct._id,
          quantity: quantityToReduce,
          price: quantityToReduce * dbProduct.price,
        });
        await orderItem.save();
        return orderItem._id;
      })
    );

    // const orderItems = await Promise.all(
    //   listCart.map(async (item) => {
    //     const existingProduct = await OrderItem.findOne({
    //       productId: item.productId._id,
    //     });

    //     if (existingProduct) {
    //       existingProduct.quantity += item.quantity;
    //       existingProduct.price += item.quantity * item.productId.price;
    //       await existingProduct.save();
    //       return existingProduct._id;
    //     } else {
    //       const productId = item.productId._id;
    //       const quantityToReduce = item.quantity;

    //       const dbProduct = await Products.findById(productId);
    //       if (!dbProduct)
    //         throw new Error(`Product with ID ${productId} not found`);

    //       dbProduct.quantity -= quantityToReduce;
    //       dbProduct.sold += quantityToReduce;
    //       await dbProduct.save();

    //       const orderItem = new OrderItem({
    //         productId: dbProduct._id,
    //         quantity: quantityToReduce,
    //         // price: dbProduct.price,
    //         price: quantityToReduce * dbProduct.price,
    //       });
    //       await orderItem.save();

    //       return orderItem._id;
    //     }
    //   })
    // );

    // Calculate total amount
    const totalAmount = listCart.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      userId: profile,
      items: orderItems,
      totalAmount,
      paymentMethod,
      status: "Loading",
      received: false,
    });
    // xoá sản phẩm trong giỏ hàng khi đã đặt hàng
    await Cart.deleteMany({ userId: profile });
    newOrder
      .save()
      .then((savedOrder) => {
        // VNPAY payment integration
        process.env.TZ = "Asia/Ho_Chi_Minh";
        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");
        const ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        const tmnCode = Tokens.vnp_TmnCode;
        const secretKey = Tokens.vnp_HashSecret;
        let vnpUrl = Tokens.vnp_Url;
        const locale = language || "vn";
        const currCode = "VND";

        let vnp_Params = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: tmnCode,
          vnp_Locale: locale,
          vnp_CurrCode: currCode,
          vnp_TxnRef: savedOrder._id,
          vnp_OrderInfo: `Thanh toan cho ma GD:${savedOrder._id}`,
          vnp_OrderType: "other",
          vnp_Amount: savedOrder.totalAmount * 100,
          vnp_ReturnUrl: `${Tokens.vnp_ReturnUrl}/Bill/${savedOrder._id}`,
          vnp_IpAddr: ipAddr,
          vnp_CreateDate: createDate,
        };

        if (bankCode) {
          vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        // Logging parameters before signing for debugging
        console.log("VNPAY Parameters before signing: ", vnp_Params);

        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac
          .update(Buffer.from(signData, "utf-8"))
          .digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        // Logging the signed URL for debugging
        vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });
        console.log("VNPAY Payment URL: ", vnpUrl);

        res.json({ url: vnpUrl });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
  }
});
// api lấy 3 sản phẩm có lượt mua nhiều nhất theo quantity
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
        $match: { totalQuantity: { $gt: 0 } }, // Lọc sản phẩm có quantity > 0
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
      _id: { $in: result.map((item) => item._id) },
    });

    // Gộp thông tin chi tiết với số lượng sản phẩm đã bán
    const topProductsWithQuantity = topProducts.map((product) => {
      const quantitySold = result.find((item) =>
        item._id.equals(product._id)
      ).totalQuantity;
      const totalPrice = product.price * quantitySold;
      return {
        ...product.toObject(),
        totalQuantity: quantitySold,
        totalPrice: totalPrice,
      };
    });

    // sắp xếp sản phẩm bán nhiều nhất lên đầu
    topProductsWithQuantity.sort((a, b) => b.totalQuantity - a.totalQuantity);

    return res.status(200).json(topProductsWithQuantity);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error retrieving the top products" });
  }
});

// tính tổng tiền tất cả các đơn hàng
orderRouter.get("/calculate-total-amount", async (req, res) => {
  try {
    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu
    const orderItems = await OrderItem.find();

    // Tính tổng số tiền dựa trên dữ liệu sản phẩm
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price,
      0
    );

    return res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error calculating total amount" });
  }
});

// tính tổng số lượng sản phẩm đã bán
orderRouter.get("/totalproducts", async (req, res) => {
  try {
    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu
    const orderItems = await OrderItem.find();

    // Tính tổng số lượng sản phẩm đã bán
    const totalProducts = orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    return res.status(200).json({ totalProducts });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error calculating total products sold" });
  }
});

// tổng doanh thu trong vòng 1 tuần
orderRouter.get("/calculate-total-amount-weekly", async (req, res) => {
  try {
    // Lấy ngày hiện tại
    const currentDate = new Date();
    // Lấy ngày 7 ngày trước
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu trong khoảng thời gian 1 tuần trước
    const orderItems = await OrderItem.find({
      createdAt: { $gte: oneWeekAgo, $lt: currentDate },
    });

    // Tính tổng số tiền dựa trên dữ liệu sản phẩm
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price,
      0
    );

    return res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error calculating total amount for the week" });
  }
});

// API tính doanh thu theo tháng
orderRouter.get("/monthly-revenue", async (req, res) => {
  try {
    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu
    const orderItems = await OrderItem.find();

    // gộp các sản phẩm theo tháng và tính tổng doanh thu
    const monthlyRevenue = orderItems.reduce((acc, item) => {
      const month = moment(item.createdAt).format("MM");
      //acc[month] là accumulator lưu trữ doanh thu của từng tháng.
      //Nếu tháng chưa tồn tại trong accumulator, khởi tạo nó với giá trị 0.
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += item.price;
      return acc;
    }, {});

    // Tạo  mảng chứa  tháng từ 1 - 12 sau đó sắp xếp
    const sortedMonthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0"); // Định dạng tháng '01', '02'
      return {
        month,
        //monthlyRevenue[month] || 0 đảm bảo rằng nếu một tháng không có dữ liệu doanh thu,
        //giá trị mặc định sẽ là 0.
        revenue: monthlyRevenue[month] || 0,
      };
    });

    return res.status(200).json(sortedMonthlyRevenue);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error calculating monthly revenue" });
  }
});

// lọc đơn hàng theo status
orderRouter.get("/:status", orderController.fetchOrderByStatus);

orderRouter.get("/:id", orderController.getOrderById);

// thanh toán bằng phương thức ship cod
orderRouter.post("/", async (req, res) => {
  // lấy dữ liệu từ client gửi lên
  const { paymentMethod, listCart, profile } = req.body;

  console.log("nội dung yêu cầu đến:", req.body);
  // tính tổng tiền của đơn hàng
  const calculateTotal = (listCart) => {
    return listCart.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  if (paymentMethod === "COD") {
    try {
      // const orderItems = await Promise.all(
      //   listCart.map(async (item) => {
      //     // Kiểm tra xem sản phẩm đã tồn tại trong cơ sở dữ liệu hay chưa
      //     const existingProduct = await OrderItem.findOne({
      //       productId: item.productId._id,
      //     });

      //     if (existingProduct) {
      //       // Nếu sản phẩm đã tồn tại, tăng số lượng của sản phẩm lên
      //       existingProduct.quantity += item.quantity;
      //       existingProduct.price += item.quantity * item.productId.price;
      //       await existingProduct.save();
      //       return existingProduct._id;
      //     } else {
      //       // Nếu sản phẩm chưa tồn tại, tạo mới sản phẩm
      //       const orderItem = new OrderItem({
      //         productId: item.productId._id,
      //         quantity: item.quantity,
      //         price: calculateTotal(listCart),
      //       });
      //       await orderItem.save();
      //       return orderItem._id;
      //     }
      //   })
      // );

      // Save order items and collect their IDs
      //Dùng Promise.all để xử lý song song việc
      //lưu từng mặt hàng trong cart vào db
      const orderItems = await Promise.all(
        listCart.map(async (item) => {
          const orderItem = new OrderItem({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.quantity * item.productId.price,
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
        .json({ message: "Lỗi khi lưu đơn hàng vào database" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Phương thức thanh toán không hợp lệ" });
  }
});

// huỷ đơn hàng
orderRouter.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (
      order.status === "Completed" ||
      order.status === "Cancel" ||
      order.status === "Processing"
    ) {
      return res
        .status(400)
        .json({ message: "Order cannot be canceled at this stage" });
    }

    order.status = "Cancel";
    order.cancelReason = req.body.cancelReason; // chọn lí do huỷ đơn hàng
    order.totalAmount = 0;
    await order.save();

    // Cập nhật các OrderItem liên quan
    for (const item of order.items) {
      const orderItem = await OrderItem.findById(item._id);
      if (orderItem) {
        orderItem.price -= orderItem.price;
        orderItem.quantity -= orderItem.quantity;
        await orderItem.save();
      }
    }

    return res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error canceling order" });
  }
});

export default orderRouter;
