import Medicine from "../models/medicine.js"

const editMedicine = async(id, medicineData) => {
    try {
        const editMedicine = await Medicine.findOneAndUpdate({_id: id}, medicineData, {new:true}).exec()
        return editMedicine
    } catch (error) {
        throw new Error ({error: error.toString()})
    }
}
export default {editMedicine}