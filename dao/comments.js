import Comment from "../models/comment.js";

const fetchCommentByPId = async (id) => {
  try {
    const allComments = await Comment.find({ $or: [{ petId: id }, { foodId: id }, { toyId: id }, {medicineId:id}] }) 
    // const allComments = await Comment.find({petId: id}) 
      .populate("userId")
      .exec();
      return allComments;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default { fetchCommentByPId };
