import Food from "../models/food.js"

const fetchAllFoods = async() =>{
    try {
        const allFoods = await Food.find({}).exec()
        return allFoods
    } catch (error) {
        throw new Error(error.toString())
    }
}

const editFood = async(id, foodData) =>{
try {
    const editFood = await Food.findOneAndUpdate({_id:id}, foodData,{new:true}).exec()
    return editFood
} catch (error) {
    throw new Error(error.toString())
}
}

export default {fetchAllFoods,editFood}