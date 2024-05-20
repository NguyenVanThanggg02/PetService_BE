import { petDao } from "../dao/index.js"

const getAllPets = async(req, res) =>{
    try {
        const allPet = await petDao.fetchAllPets()
        res.status(200).json(allPet)
    } catch (error) {
        res.status(500).json({error: error.toString()})
    }
}
const updatePet = async(req, res) =>{
    try {
        const updatePet = await petDao.editPet(req.params.id, req.body);
        res.status(200).json(updatePet)
        console.log('updated');
    } catch (error) {
        res.status(500).json({error: error.toString()})
        console.log("failed to update pet");
    }
}

export default {getAllPets,updatePet}