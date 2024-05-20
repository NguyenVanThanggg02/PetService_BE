import Pet from "../models/pet.js"

const fetchAllPets = async()=>{
    try {
        const allPet = await Pet.find({}).exec()
        return allPet
    } catch (error) {
        throw new Error(error.toString())
    }
}
export default {fetchAllPets}