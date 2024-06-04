import express from "express";
import Pet from "../models/pet.js";
import Food from "../models/food.js";
import Medicine from "../models/medicine.js";
import Toy from "../models/toy.js";

const searchRouter = express.Router();

searchRouter.get('/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i'); // Use 'i' flag here directly
    const searchRgx = rgx(name);

    const [pets, foods, medicines, toys] = await Promise.all([
      Pet.find({ breed: { $regex: searchRgx } }),
      Food.find({ name: { $regex: searchRgx } }),
      Medicine.find({ name: { $regex: searchRgx } }),
      Toy.find({ name: { $regex: searchRgx } }),
    ]);

    const searchResult = { pets, foods, medicines, toys };

    res.send(searchResult);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

export default searchRouter;
