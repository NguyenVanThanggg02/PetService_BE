import Comment from "../models/comment.js";

const fetchCommentByPId = async (id) => {
  try {
    const allComments = await Comment.find({ $or: [{ petId: id }, { foodId: id }, { toyId: id }, {medicineId:id}] }) 
    // const allComments = await Comment.find({petId: id}) 
      // .populate("userId")
      .exec();
      return allComments;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const deleteCommentByPId = async (id) => {
  try {
    const deleteCmt = await Comment.deleteOne({_id:id}).exec();
    return deleteCmt
  } catch (error) {
    throw new Error(error.toString()); 
  }
}
const editCommentByPId = async (id, newText) => {
try {
  const editText = await Comment.findOneAndUpdate({_id:id}, newText, {new:true}).exec()
  return editText
} catch (error) {
  throw new Error(error.toString())
}
}

export default { fetchCommentByPId, deleteCommentByPId ,editCommentByPId};
