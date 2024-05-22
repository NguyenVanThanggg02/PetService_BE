import express from 'express';
import { petController } from '../controllers/index.js';

const petRouter = express.Router();

petRouter.get('/', petController.getAllPets);
petRouter.put('/:id', petController.updatePet);
petRouter.delete('/:id', petController.deletePet);
petRouter.get('/latest', petController.getLatestPet);
export default petRouter;
