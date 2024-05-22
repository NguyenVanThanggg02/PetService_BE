import Medicine from "../models/medicine.js";

const editMedicine = async (id, medicineData) => {
    try {
        const editMedicine = await Medicine.findOneAndUpdate({ _id: id }, medicineData, { new: true }).exec();
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
        const latestMedicines = await Medicine.find({}).sort({ createdAt: -1 }).limit(4).exec();
        return latestMedicines;
    } catch (error) {
        throw new Error(error.toString());
    }
};

export default { editMedicine, deleteMedicine, getLatestMedicines };
