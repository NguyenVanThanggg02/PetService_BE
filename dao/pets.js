import Pet from "../models/pet.js";

const fetchAllPets = async () => {
    try {
        const allPet = await Pet.find({}).exec();
        return allPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const editPet = async (id, petData) => {
    try {
        const editPet = await Pet.findOneAndUpdate({ _id: id }, petData, { new: true }).exec();
        return editPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const deletePet = async (id) => {
    try {
        const deletedPet = await Pet.findByIdAndDelete(id).exec();
        return deletedPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const getLatestPet = async () => {
    try {
        const latestPet = await Pet.find({}).sort({ createdAt: -1 }).limit(4).exec();
        return latestPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

export default { fetchAllPets, editPet, deletePet, getLatestPet };
