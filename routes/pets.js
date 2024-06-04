import express from 'express';
import { petController } from '../controllers/index.js';
const petRouter = express.Router();

petRouter.get('/', petController.getAllPets)
petRouter.get('/:pettype', petController.fetchPetByPetType)
petRouter.put('/:id', petController.updatePet)
petRouter.post('/', petController.createPet)
export default petRouter