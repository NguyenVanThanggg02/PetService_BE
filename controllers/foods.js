import { foodDao } from "../dao/index.js"

const getAllFoods = async (req, res) =>{
    try {
        const allFoods = await foodDao.fetchAllFoods()
        res.status(200).json(allFoods)
    } catch (error) {
        res.status(500).json({error: error.toString()})
    }
}

const updateFood = async (req, res) =>{
    try {
        const updateFood = await foodDao.editFood(req.params.id, req.body)
        res.status(200).json(updateFood)
        console.log('updated food');
    } catch (error) {
        res.status(500).json({error:error.toString()})
        console.log('failed to update food');
    }
}
export default {getAllFoods,updateFood}