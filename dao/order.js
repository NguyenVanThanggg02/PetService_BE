import Order from "../models/order.js";

const fetchAllOrder = async () => {
  try {
    const AllOrder = await Order.find({})
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "products",
        },
      })
      .exec();
    return AllOrder;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const fetchListOrderOfUser = async (id) => {
  try {
    const orders = await Order.find({ userId: id })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "products",
        },
      })
      .exec();
    return orders;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const updateOrder = async (id, orDerData) => {
  try {
    const updateOrder = await Order.findOneAndUpdate({ _id: id }, orDerData, {
      new: true,
    }).exec();
    return updateOrder;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const fetchOrderById = async (id) => {
  try {
    const orderById = await Order.find({ _id: id })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "products",
        },
      })
      .exec();
    return orderById;
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  updateOrder,
  fetchListOrderOfUser,
  fetchOrderById,
  fetchAllOrder,
};
