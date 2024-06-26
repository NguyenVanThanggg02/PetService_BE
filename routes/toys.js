import express from 'express';
import { toyController } from '../controllers/index.js';

const toyRouter = express.Router();


toyRouter.get('/', toyController.getAllToy)
toyRouter.get('/:pettype', toyController.fetchToyByPetType)
toyRouter.put('/:id', toyController.updateToy)
toyRouter.post('/', toyController.createToy)

toyRouter.delete('/:id', toyController.deleteToy);
toyRouter.get('/latest', toyController.getLatestToy)
export default toyRouter;
