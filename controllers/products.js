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

const updateProduct = async (req, res) => {
  try {
    const updateProduct = await productDao.updateProduct(
      req.params.id,
      req.body
    );
    res.status(200).json(updateProduct);
    console.log("Updated product successfully");
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log("Failed to update product");
  }
};

export default { getLatestProducts, updateProduct };
