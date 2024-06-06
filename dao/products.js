import Products from "../models/products.js";

const fetchLatestProduct = async () => {
    try {
      return await Products.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("category")
        .exec();
    } catch (error) {
      throw new Error(error.toString());
    }
  };

  export default {fetchLatestProduct}