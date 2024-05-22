import { toyDao } from "../dao/index.js";

const updateToy = async (req, res) => {
  try {
    const updateToy = await toyDao.editToy(req.params.id, req.body);
    res.status(200).json(updateToy);
    console.log('Updated toy successfully');
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log('Failed to update toy');
  }
};

const deleteToy = async (req, res) => {
  try {
    const deletedToy = await toyDao.deleteToy(req.params.id);
    res.status(200).json(deletedToy);
    console.log('Deleted toy successfully');
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log('Failed to delete toy');
  }
};

const getLatestToy = async (req, res) => {
  try {
    const latestToy = await toyDao.getLatestToy(); 
    res.status(200).json(latestToy);
    console.log('getLatestToy successfully');
  } catch (error) {
    res.status(500).json({ error: error.toString() });
    console.log('Failed to fetch latest toy');
  }
};

export default { updateToy, deleteToy, getLatestToy };
