import express from 'express';
import { foodController } from '../controllers/index.js';
const foodRouter = express.Router()

foodRouter.get('/', foodController.getAllFoods)
foodRouter.put('/:id', foodController.updateFood)

export default  foodRouter