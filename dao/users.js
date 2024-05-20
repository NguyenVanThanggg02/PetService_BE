import User from "../models/user.js"

const fetAllUser = async () =>{
    try {
        return await User.find({}).exec()
    } catch (error) {
        throw new Error(error.toString())
    }
};

const updateUser = async (username, userData) => {
    try {
      return await User.findOneAndUpdate(
        { username: username },
        userData,
        { new: true }
      );
    } catch (error) {
      throw new Error(error.toString());
    }
  };

export default {
    fetAllUser, 
    updateUser};

