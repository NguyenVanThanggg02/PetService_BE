import Food from "../models/food.js";

const fetchAllFoods = async () => {
    try {
        const allFoods = await Food.find({}).exec();
        return allFoods;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const editFood = async (id, foodData) => {
    try {
        const editFood = await Food.findOneAndUpdate({ _id: id }, foodData, { new: true }).exec();
        return editFood;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const deleteFood = async (id) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(id).exec();
        return deletedFood;
    } catch (error) {
        throw new Error(error.toString());
    }
};

const getLatestFood = async () => {
    try {
        const latestFood = await Food.find({}).sort({ createdAt: -1 }).limit(4).exec();
        return latestFood;
    } catch (error) {
        throw new Error(error.toString());
    }
};
const createFood = async ({ name, image,quantity,description,pettype }) => {
    try {
        const newFood = await Food.create({ name, image,quantity,description,pettype });
        return newFood._doc;
    } catch (error) {
        throw new Error(error.toString())
    }
}


const getFoodByPetType = async (pettype) => {
    try {
      const foodByType = await Food.find({ pettype: { $regex: new RegExp(`^${pettype}$`, 'i') } }).exec();
      return foodByType;
    } catch (error) {
      throw new Error(error.toString());
    }
  };


export default 
{
    fetchAllFoods,
    editFood,
    createFood,
    getFoodByPetType, getLatestFood, deleteFood
}
