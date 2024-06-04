import { toyDao } from "../dao/index.js"


const getAllToy = async (req, res) => {
    try {
        const allToy = await toyDao.fetchAllToy()
        res.status(200).json(allToy)
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}

const updateToy = async(req, res) =>{
    try {
        const updateToy = await toyDao.editToy(req.params.id, req.body)
        res.status(200).json(updateToy)
        console.log('Updated toy successfully');
    } catch (error) {
        res.status(500).json({error: error.toString()})
        console.log('faild to update toy');
    }
}


// Create a new product
const createToy = async (req, res) => {
    try {
        const { name,quantity, description, pettype, image } = req.body;
        const result = await toyDao.createPet({ name,quantity, description, pettype, image });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }

}


const fetchToyByPetType = async (req, res) => {
    try {
      const toyByPetType = await toyDao.getToyByPetType(req.params.pettype);
      res.status(200).json(toyByPetType);
    } catch (error) {
      res.status(500).json({
        error: error.toString(),
      });
    }
  };

export default 
{
    getAllToy,
    updateToy,
    createToy,
    fetchToyByPetType
}