import { medicineDao } from "../dao/index.js"


const getAllMedicine = async (req, res) => {
    try {
        const allMedicine = await medicineDao.fetchAllMedicine()
        res.status(200).json(allMedicine)
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}

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



// Create a new product
const createMedicine = async (req, res) => {
    try {
        const { name, image, quantity, description, pettype } = req.body;
        const result = await medicineDao.createMedicine({ name, image, quantity, description, pettype });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }

}


const fetchMedicineByPetType = async (req, res) => {
    try {
      const medicineByPetType = await medicineDao.getMedicineByPetType(req.params.pettype);
      res.status(200).json(medicineByPetType);
    } catch (error) {
      res.status(500).json({
        error: error.toString(),
      });
    }
  };

export default 
{
    getAllMedicine,
    createMedicine,
    updateMedicine,
    fetchMedicineByPetType
}