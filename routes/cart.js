import express from "express";
import { cartController } from "../controllers/index.js";

const cartRouter = express.Router();
cartRouter.get('/:id',cartController.getListCartOfUser )
cartRouter.delete('/:id',cartController.deleteListCartOfUser)
cartRouter.post('/', cartController.addProductToCart);
export default cartRouter