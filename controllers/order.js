import Order from "../models/order.js";

const createOrder = async (req, res) => {
  const { username, fullname, email, address, phone, listCart, total } =
    req.body;

  try {
    const newOrder = new Order({
      username,
      fullname,
      email,
      address,
      phone,
      listCart,
      total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createOrder,
  getOrders,
};
