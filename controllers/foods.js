import { foodDao } from "../dao/index.js"

const getAllFoods = async (req, res) =>{
    try {
        const allFoods = await foodDao.fetAllUser()
        res.status(200).json(allFoods)
    } catch (error) {
        res.status(500).json({error: error.toString()})
    }
}
export default {getAllFoods}