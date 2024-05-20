import { userDao } from "../dao/index.js";

const getAllUsers = async (req, res) => {
  try {
    const allUser = await userDao.fetAllUser();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const updateUser = async (req, res) => {
  try {
    res.status(200).json(await userDao.updateUser(req.params.username, req.body));
    console.log('Edit user successfully');
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
    console.log('Edit user failed');

  }
};

export default { 
  getAllUsers, 
  updateUser };
