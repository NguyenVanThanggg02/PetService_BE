import { petDao } from "../dao/index.js";

const getAllPets = async (req, res) => {
    try {
        const allPet = await petDao.fetchAllPets();
        res.status(200).json(allPet);
    } catch (error) {

        res.status(500).json({ error: error.toString() })
    }
}
const updatePet = async (req, res) => {
    try {
        const updatePet = await petDao.editPet(req.params.id, req.body);
        res.status(200).json(updatePet);
        console.log('Updated pet successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log("Failed to update pet");
    }
};

const deletePet = async (req, res) => {
    try {
        const deletedPet = await petDao.deletePet(req.params.id);
        res.status(200).json(deletedPet);
        console.log('Deleted pet successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log("Failed to delete pet");
    }
};

const getLatestPet = async (req, res) => {
    try {
        const latestPet = await petDao.getLatestPet();
        res.status(200).json(latestPet);
        console.log('Get latest pet successfully');
    } catch (error) {

        res.status(500).json({ error: error.toString() })
        console.log("failed to update pet");
    }
};



// Create a new product
const createPet = async (req, res) => {
    try {
        const { breed, gender, image, quantity, description, pettype } = req.body;
        const result = await petDao.createPet({ breed, gender, image, quantity, description, pettype });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }

}


const fetchPetByPetType = async (req, res) => {
    try {
      const petByPetType = await petDao.getPetByPetType(req.params.pettype);
      res.status(200).json(petByPetType);
    } catch (error) {
      res.status(500).json({
        error: error.toString(),
      });
    }
  };


export default
    {
        getAllPets,
        updatePet,
        createPet,
        fetchPetByPetType,  deletePet, getLatestPet
    }
