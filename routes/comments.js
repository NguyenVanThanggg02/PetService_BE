import express from "express";
import { commentsController } from "../controllers/index.js";
const commentRouter = express.Router()

commentRouter.get('/:id', commentsController.getAllCommentByPId)
commentRouter.delete('/:id', commentsController.removeCommentByPId)
commentRouter.put('/:id', commentsController.updateCmt)
export default commentRouter