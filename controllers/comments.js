import { commentDao } from "../dao/index.js";

const getAllCommentByPId = async (req, res) => {
  try {
    const commentPId = req.params.id;
    const allComments = await commentDao.fetchCommentByPId(commentPId);
    if (allComments) {
      res.status(200).json(allComments);
    } else {
      res.status(404).json("not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const removeCommentByPId = async (req, res) => {
  try {
    const removeCmt = await commentDao.deleteCommentByPId(req.params.id);
    if (removeCmt) {
      res.status(200).json({ message: "Deleted comment successfully" });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const updateCmt = async (req, res) => {
  try {
    const updateCmt = await commentDao.editCommentByPId(
      req.params.id,
      req.body
    );
    if (updateCmt) {
      res.status(200).json({ message: "Updated comment successfully" });
    } else {
      res.status(400).json({ message: "not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
export default { getAllCommentByPId, removeCommentByPId, updateCmt };
