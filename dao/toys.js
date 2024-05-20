import Toy from "../models/toy.js";

const editToy = async (id, toyData) => {
  try {
    const editToy = await Toy.findOneAndUpdate({ _id: id }, toyData, {
      new: true,
    }).exec();
    return editToy;
  } catch (error) {
    throw new Error({ error: error.toString() });
  }
};
export default { editToy };
