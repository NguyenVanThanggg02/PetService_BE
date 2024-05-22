import { userDao } from "../dao/index.js";

const getAllUsers = async (req, res) => {
  try {
    const allUser = await userDao.fetAllUser();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export default { getAllUsers };
