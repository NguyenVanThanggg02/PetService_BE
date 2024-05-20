import Food from "../models/food.js"

const fetchAllFoods = async() =>{
    try {
        const allFoods = await Food.find({}).exec()
        return allFoods
    } catch (error) {
        throw new Error(error.toString())
    }
}

export default {fetchAllFoods}