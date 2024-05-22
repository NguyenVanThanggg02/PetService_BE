import express from 'express';
import { foodController } from '../controllers/index.js';

const foodRouter = express.Router();

foodRouter.get('/', foodController.getAllFoods);
foodRouter.get('/latest', foodController.getLatestFood); 
foodRouter.put('/:id', foodController.updateFood);
foodRouter.delete('/:id', foodController.deleteFood); 

export default foodRouter;
