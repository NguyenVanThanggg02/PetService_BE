import Toy from "../models/toy.js";


const fetchAllToy = async () => {
  try {
    const allToy = await Toy.find({}).exec()
    return allToy
  } catch (error) {
    throw new Error(error.toString())
  }
}

const editToy = async (id, toyData) => {
  try {
    const editToy = await Toy.findOneAndUpdate({ _id: id }, toyData, {
      new: true,
    }).exec();
    return editToy;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteToy = async (id) => {
  try {
    const deletedToy = await Toy.findByIdAndDelete(id).exec();
    if (!deletedToy) {
      throw new Error("Toy not found");
    }
    return deletedToy;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getLatestToy = async () => {
  try {
    const latestToy = await Toy.find({}).sort({ createdAt:-1 }).limit(4).exec();
    return latestToy;
  } catch (error) {
    throw new Error(error.toString());
  }
};
    
    

const createPet = async ({ name, quantity, description, pettype, image }) => {
  try {
    const newToy = await Toy.create({ name, quantity, description, pettype, image });
    return newToy._doc;
  } catch (error) {
    throw new Error(error.toString())
  }
}


const getToyByPetType = async (pettype) => {
  try {
    const toyByType = await Toy.find({ pettype: { $regex: new RegExp(`^${pettype}$`, 'i') } }).exec();
    return toyByType;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default
  {
    fetchAllToy,
    editToy,
    createPet,
    getToyByPetType, getLatestToy, deleteToy
  };
