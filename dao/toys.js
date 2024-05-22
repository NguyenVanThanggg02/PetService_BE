import Toy from "../models/toy.js";

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

export default { editToy, deleteToy, getLatestToy };
