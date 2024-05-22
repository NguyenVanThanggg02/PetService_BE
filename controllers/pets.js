import { petDao } from "../dao/index.js";

const getAllPets = async (req, res) => {
    try {
        const allPet = await petDao.fetchAllPets();
        res.status(200).json(allPet);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

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
        res.status(500).json({ error: error.toString() });
        console.log("Failed to get latest pet");
    }
};

export default { getAllPets, updatePet, deletePet, getLatestPet };
