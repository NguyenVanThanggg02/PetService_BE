import express from 'express';
import { medicineController } from '../controllers/index.js';

const medicineRouter = express.Router();

medicineRouter.get('/', medicineController.getAllMedicine)
medicineRouter.get('/:pettype', medicineController.fetchMedicineByPetType)
medicineRouter.put('/:id', medicineController.updateMedicine)
medicineRouter.post('/', medicineController.createMedicine)
medicineRouter.delete('/:id', medicineController.deleteMedicine);
medicineRouter.get('/latest', medicineController.getLatestMedicines);
export default medicineRouter;
