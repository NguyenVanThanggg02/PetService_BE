import User from "../models/user.js";

const fetchAllUsers = async () => {
  try {
    return await User.find({}).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

const forgotPass = async (gmail) => {
  try {
    return await User.findOne({ gmail }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (username, userData) => {
  try {
    return await User.findOneAndUpdate(
      { username },
      userData,
      { new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByUsername = async (username) => {
  try {
    const getUser = await User.findOne({ username }).exec();
    if (!getUser) throw new Error(`User ${username} not found`);
    return getUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { fetchAllUsers, forgotPass, updateUser, getUserByUsername };
