import { toyDao } from "../dao/index.js"

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
export default {updateToy}