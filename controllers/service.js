import { serviceDao } from "../dao/index.js";

const fetchAllService = async (req, res) => {
  try {
    const service = await serviceDao.fetchAllService()
    res.status(200).json(service)
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export default { fetchAllService };
