import express from 'express';
import { userController } from '../controllers/index.js';
const userRouter = express.Router()

userRouter.get('/',userController.getAllUsers)
userRouter.put('/:username',userController.updateUser)

export default userRouter
