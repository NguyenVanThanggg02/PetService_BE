import Pet from "../models/pet.js"

const fetchAllPets = async () => {
    try {
        const allPet = await Pet.find({}).exec()
        return allPet
    } catch (error) {
        throw new Error(error.toString())
    }
}
const editPet = async (id, petData) => {
    try {
        const editPet = await Pet.findOneAndUpdate({ _id: id }, petData, { new: true }).exec()
        return editPet
    } catch (error) {
        throw new Error(error.toString())
    }
}


const createPet = async ({ breed, gender, image, quantity, description, pettype }) => {
    try {
        const newPet = await Pet.create({ breed, gender, image, quantity, description, pettype });
        return newPet._doc;
    } catch (error) {
        throw new Error(error.toString())
    }
}


const getPetByPetType = async (pettype) => {
    try {
      const petByType = await Pet.find({ pettype: { $regex: new RegExp(`^${pettype}$`, 'i') } }).exec();
      return petByType;
    } catch (error) {
      throw new Error(error.toString());
    }
  };

export default
    {
        fetchAllPets,
        editPet,
        createPet,
        getPetByPetType
    }