import { orderDao } from "../dao/index.js";

const getAllOrder = async (req, res) => {
  try {
    const AllOrder = await orderDao.fetchAllOrder();
    res.status(200).json(AllOrder);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getListOrderOfUser = async (req, res) => {
  try {
    const orderByUserId = req.params.id;
    const orderList = await orderDao.fetchListOrderOfUser(orderByUserId);
    if (orderList) {
      res.status(200).json(orderList);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updateOrder = await orderDao.updateOrder(req.params.id, req.body);
    res.status(200).json(updateOrder);
    console.log("Updated order successfully");
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log("Failed to order product");
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderBId = await orderDao.fetchOrderById(orderId);
    if (orderBId) {
      res.status(200).json(orderBId);
    } else {
      res.status(404).json("not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

export default { updateOrder, getListOrderOfUser, getOrderById, getAllOrder };
