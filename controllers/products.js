import { productDao } from "../dao/index.js";

const getLatestProducts = async (req, res) => {
    try {
      const latestProduct = await productDao.fetchLatestProduct();
      res.status(200).json(latestProduct);
    } catch (error) {
      console.error("Error fetching latest product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  
const fetchProductsByCategory = async (req, res) => {
  try {
    const productsByCategory = await productDao.fetchProductByCategory(req.params.cateId);
    res.status(200).json(productsByCategory);
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};


const fetchProductsByPetType = async (req, res) => {
  try {
    const petByPetType = await productDao.getProductsByPetType(req.params.pettype);
    res.status(200).json(petByPetType);
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};



  export default {getLatestProducts,fetchProductsByCategory,fetchProductsByPetType}