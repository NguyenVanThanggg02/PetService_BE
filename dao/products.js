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

const fetchProductByCategory = async (cateId) => {
  try {
    const allProducts = await Products.find({ category: cateId })
      .populate("category")
      .exec();
    return allProducts;
  } catch (error) {
    throw new Error(error.toString());
  }
};


const getProductsByPetType = async (pettype) => {
  try {
    const petByType = await Products.find({ pettype: { $regex: new RegExp(`^${pettype}$`, 'i') } }).exec();
    return petByType;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteProduct = async (id) => {
  try {
    const deleteProduct = await Products.findByIdAndDelete(id).exec();
    return deleteProduct;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default { fetchLatestProduct, fetchProductByCategory, getProductsByPetType, updateProduct, deleteProduct }
