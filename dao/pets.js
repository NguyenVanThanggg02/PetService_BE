import Pet from "../models/pet.js"

const fetchAllPets = async()=>{
    try {
        const allPet = await Pet.find({}).exec()
        return allPet
    } catch (error) {
        throw new Error(error.toString())
    }
}
const editPet = async(id, petData)=>{
try {
    const editPet = await Pet.findOneAndUpdate({_id:id}, petData,{new:true}).exec()
    return editPet
} catch (error) {
 throw new Error(error.toString())   
}
}
export default {fetchAllPets,editPet}