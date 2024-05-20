import express from "express";
import { commentsController } from "../controllers/index.js";
const commentRouter = express.Router()

commentRouter.get('/:id', commentsController.getAllCommentByPId)
export default commentRouter