import { cartDao } from "../dao/index.js";

const getListCartOfUser = async (req, res) => {
  try {
    const cartByUserId = req.params.id;
    const cartList = await cartDao.fetchListCartOfUser(cartByUserId);
    if (cartList) {
      res.status(200).json(cartList);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const deleteListCartOfUser = async (req, res) => {
  try {
    const cartId = req.params.id;
    const cartList = await cartDao.removeListCartOfUser(cartId);
    if (cartList) {
      res.status(200).json(cartList);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const addProductToCart = async (req, res) => {
  try {
    const { userId, productId,categoryId, quantity } = req.body;
    const newCartItem = await cartDao.addProductToCart(userId, productId,categoryId, quantity);
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const updateCart = async (req, res) => {
  try {
    const updateCartItem = await cartDao.updateCart(req.params.id,req.body)
    res.status(200).json(updateCartItem);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    
  }
}
export default { getListCartOfUser, deleteListCartOfUser, addProductToCart, updateCart };
