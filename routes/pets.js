import express from 'express';
import { petController } from '../controllers/index.js';
const petRouter = express.Router();

petRouter.get('/', petController.getAllPets)
export default petRouter