import Medicine from "../models/medicine.js";

const fetchAllMedicine = async () => {
  try {
    const allMedicine = await Medicine.find({}).exec();
    return allMedicine;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const editMedicine = async (id, medicineData) => {
  try {
    const editMedicine = await Medicine.findOneAndUpdate(
      { _id: id },
      medicineData,
      { new: true }
    ).exec();
    return editMedicine;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteMedicine = async (id) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(id).exec();
    return deletedMedicine;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getLatestMedicines = async () => {
  try {
    const latestMedicines = await Medicine.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .exec();
    return latestMedicines;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const createMedicine = async ({
  name,
  image,
  quantity,
  description,
  pettype,
}) => {
  try {
    const newMedicine = await Medicine.create({
      name,
      image,
      quantity,
      description,
      pettype,
    });
    return newMedicine._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getMedicineByPetType = async (pettype) => {
  try {
    const medicineByType = await Medicine.find({
      pettype: { $regex: new RegExp(`^${pettype}$`, "i") },
    }).exec();
    return medicineByType;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  fetchAllMedicine,
  editMedicine,
  createMedicine,
  getMedicineByPetType,
  getLatestMedicines,
  deleteMedicine,
};
