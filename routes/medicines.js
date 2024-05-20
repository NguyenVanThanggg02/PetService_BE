import express from 'express';
import { medicineController } from '../controllers/index.js';
const medicineRouter = express.Router();

medicineRouter.put('/:id', medicineController.updateMedicine)

export default medicineRouter