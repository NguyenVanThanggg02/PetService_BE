import { commentDao } from "../dao/index.js";

const getAllCommentByPId = async(req,res) =>{
    try {
        const commentPId = req.params.id;
        const allComments = await commentDao.fetchCommentByPId(commentPId);
        if(allComments){
            res.status(200).json(allComments);
        }else{
            res.status(404).json('not found');
        }
    } catch (error) {
        res.status(500).json({message:error.toString()})
    }
}
export default{getAllCommentByPId}