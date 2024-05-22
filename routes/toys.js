import express from 'express';
import { toyController } from '../controllers/index.js';

const toyRouter = express.Router();

toyRouter.put('/:id', toyController.updateToy);
toyRouter.delete('/:id', toyController.deleteToy);
toyRouter.get('/latest', toyController.getLatestToy)
export default toyRouter;
