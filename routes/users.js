import express from 'express';
import { userController } from '../controllers/index.js';
const userRouter = express.Router()

userRouter.get('/',userController.getAllUsers)

export default userRouter