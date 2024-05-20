import express from 'express';
import { toyController } from '../controllers/index.js';
const toyRouter = express.Router();

toyRouter.put('/:id', toyController.updateToy)

export default toyRouter