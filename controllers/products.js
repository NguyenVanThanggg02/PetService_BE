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

  export default {getLatestProducts}