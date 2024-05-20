import { petDao } from "../dao/index.js"

const getAllPets = async(req, res) =>{
    try {
        const allPet = await petDao.fetchAllPets()
        res.status(200).json(allPet)
    } catch (error) {
        res.status(500).json({error: error.toString()})
    }
}

export default {getAllPets}