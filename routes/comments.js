import express from "express";
import { commentsController } from "../controllers/index.js";
const commentRouter = express.Router()

commentRouter.get('/:id', commentsController.getAllCommentByPId)
commentRouter.get('/blog/:bid', commentsController.getAllCommentByBId)
commentRouter.delete('/:id', commentsController.removeCommentByPId)
commentRouter.put('/:id', commentsController.updateCmt)
commentRouter.post('/', commentsController.addComment)
export default commentRouter