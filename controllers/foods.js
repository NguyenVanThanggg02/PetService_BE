import { foodDao } from "../dao/index.js";

const getAllFoods = async (req, res) => {
    try {
        const allFoods = await foodDao.fetchAllFoods();
        res.status(200).json(allFoods);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const updateFood = async (req, res) => {
    try {
        const updateFood = await foodDao.editFood(req.params.id, req.body);
        res.status(200).json(updateFood);
        console.log('Updated food');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log('Failed to update food');
    }
};

const deleteFood = async (req, res) => {
    try {
        const deletedFood = await foodDao.deleteFood(req.params.id);
        res.status(200).json(deletedFood);
        console.log('Deleted food successfully');
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log('Failed to delete food');
    }
};

const getLatestFood = async (req, res) => {
    try {
        const latestFood = await foodDao.getLatestFood();
        res.status(200).json(latestFood);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export default { getAllFoods, updateFood, deleteFood, getLatestFood };
