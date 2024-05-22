import express from 'express';
import { medicineController } from '../controllers/index.js';

const medicineRouter = express.Router();

medicineRouter.put('/:id', medicineController.updateMedicine);
medicineRouter.delete('/:id', medicineController.deleteMedicine);
medicineRouter.get('/latest', medicineController.getLatestMedicines);
export default medicineRouter;
