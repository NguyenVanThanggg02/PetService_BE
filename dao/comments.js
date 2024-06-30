import { text } from "express";
import Comment from "../models/comment.js";

const fetchCommentByPId = async (id) => {
  try {
    const allComments = await Comment.find({ productId: id})
      .populate("userId")
      .exec();
    return allComments;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const fetchCommentByBId = async (bid) => {
  try {
    const allComments = await Comment.find({ blogId: bid})
      .populate("userId")
      .exec();
    return allComments;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const deleteCommentByPId = async (id) => {
  try {
    const deleteCmt = await Comment.deleteOne({ _id: id }).exec();
    return deleteCmt;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const editCommentByPId = async (id, newText) => {
  try {
    const editText = await Comment.findOneAndUpdate({ _id: id }, newText, {
      new: true,
    }).exec();
    return editText;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const addComment = async (
  text,
  userId,
  productId,
  blogId
) => {
  try {
    const addComment = await Comment.create({
      text,
      userId,
      productId,
      blogId,
    });
    return addComment;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  fetchCommentByPId,
  deleteCommentByPId,
  editCommentByPId,
  addComment,
  fetchCommentByBId
};
