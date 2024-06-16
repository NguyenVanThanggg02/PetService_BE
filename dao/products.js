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
  const updateProduct = async (id, productData) => {
    try {
        const editProduct = await Products.findOneAndUpdate({ _id: id }, productData, { new: true }).exec()
        return editProduct
    } catch (error) {
        throw new Error(error.toString())
    }
}

const deleteProduct = async (id) => {
  try {
      const deleteProduct = await Products.findByIdAndDelete(id).exec();
      return deleteProduct;
  } catch (error) {
      throw new Error(error.toString());
  }
};

  export default {fetchLatestProduct, updateProduct, deleteProduct}