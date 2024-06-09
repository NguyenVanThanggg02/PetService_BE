import Cart from "../models/cart.js";

const fetchListCartOfUser = async (id) => {
    try {
      const cart = await Cart.find({ userId: id })
        .populate("userId").populate('productId').populate('categoryId')
        .exec();
      return cart;
    } catch (error) {
      throw new Error(error.toString());
    }
  };
  const removeListCartOfUser = async (id) => {
      try {
          const cart = await Cart.deleteOne({ _id: id }).exec();
          return cart;
      } catch (error) {
      throw new Error(error.toString());
          
      }
  }
  const addProductToCart = async (userId, productId,categoryId, quantity ) => {
    try {
      const newCartItem = new Cart({ userId, productId, categoryId,quantity });
      await newCartItem.save();
      return newCartItem;
    } catch (error) {
      throw new Error(error.toString());
    }
  };

  const updateCart = async (id, Uquantity) =>{
    try {
        const updateCartItem = await Cart.findOneAndUpdate({ _id: id}, Uquantity, {new:true}) ;
        return updateCartItem;
    } catch (error) {
      throw new Error(error.toString());
      
    }
  }

  export default {fetchListCartOfUser, removeListCartOfUser, addProductToCart, updateCart}