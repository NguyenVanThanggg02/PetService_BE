import { response } from "express";
import { productDao } from "../dao/index.js";
import Products from "../models/products.js";

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


const upLoadImageProduct = async (req, res) => {
  const { pid } = req.params;
  console.log(pid);
  if (!req.files) throw new Error("Missing inputs");
  const response = await Products.findByIdAndUpdate(pid, { $push: { image: { $each: req.files.map(el => el.path) } } }, { new: true })

  res.status(200).json({
    status: response ? true : false,
    updateProducts: response ? response : 'Cannot upload images'
  });
};
const createProduct = async (req, res) => {
  try {
    // Lấy thông tin sản phẩm từ req.body
    const { name, description, quantity, pettype, category, price, image } = req.body;

    // Đảm bảo rằng image luôn là mảng
    let images = image;
    if (!Array.isArray(images)) {
      images = [images];
    }

    // Tạo sản phẩm mới
    const newProduct = new Products({
      name,
      description,
      quantity,
      pettype,
      category,
      price,
      image: images, // Đặt images vào thuộc tính image của sản phẩm
    });

    // Lưu sản phẩm vào database
    await newProduct.save();
    console.log(images);
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product. Please try again." });
  }
};


export default { getLatestProducts, fetchProductsByCategory, fetchProductsByPetType, updateProduct, upLoadImageProduct,createProduct }

