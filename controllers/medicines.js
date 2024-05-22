import { medicineDao } from "../dao/index.js";

const updateMedicine = async (req, res) => {
    try {
        const updateMedicine = await medicineDao.editMedicine(req.params.id, req.body);
        res.status(200).json(updateMedicine);
        console.log('Updated medicine successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log('Failed to update medicine');
    }
};

const deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await medicineDao.deleteMedicine(req.params.id);
        res.status(200).json(deletedMedicine);
        console.log('Deleted medicine successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log('Failed to delete medicine');
    }
};

const getLatestMedicines = async (req, res) => {
    try {
        const latestMedicines = await medicineDao.getLatestMedicines();
        res.status(200).json(latestMedicines);
        console.log('Get latest medicines successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log('Failed to get latest medicines');
    }
};

export default { updateMedicine, deleteMedicine, getLatestMedicines };
