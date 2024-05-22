import { medicineDao } from "../dao/index.js"

const updateMedicine = async(req, res) =>{
    try {
        const updateMedicine = await medicineDao.editMedicine(req.params.id, req.body);
        res.status(200).json(updateMedicine)
        console.log('updatedMedicine successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log("error updatingMedicine");
    }
}
export default {updateMedicine}