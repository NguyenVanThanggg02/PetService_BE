import express from 'express';
import { foodController } from '../controllers/index.js';
const foodRouter = express.Router()

foodRouter.get('/', foodController.getAllFoods)
foodRouter.get('/:pettype', foodController.fetchFoodByPetType)
foodRouter.put('/:id', foodController.updateFood)
foodRouter.post('/', foodController.createFood)

export default  foodRouter