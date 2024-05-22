<<<<<<< HEAD
import createError from "http-errors";
import User from "../models/user.js";
import express from "express";
const usersRouter = express.Router();

// GET: /users -> Lấy tất cả người dùng
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) throw createError(404, "Không tìm thấy người dùng");
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// GET: /users/:username -> Lấy người dùng theo tên người dùng
usersRouter.get("/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).exec();
    if (!user) throw createError(404, `Người dùng ${username} không tồn tại`);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// POST: /users/register -> Đăng ký người dùng mới
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw createError.BadRequest("Yêu cầu nhập tên người dùng và mật khẩu");
    }
    const existingUser = await User.findOne({ username: username }).exec();
    if (existingUser) throw createError.Conflict("Người dùng đã tồn tại");
    const newUser = new User({ username, password });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});
// POST: /users/login -> Người dùng đăng nhập
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) throw createError.BadRequest("Username is not register");
    if (password !== user.password) {
      throw createError.BadRequest("Password is incorrect");
    }
    res.status(200).json(user.username);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
=======
import express from 'express';
import { userController } from '../controllers/index.js';
const userRouter = express.Router()

userRouter.get('/',userController.getAllUsers)

export default userRouter
>>>>>>> 98072bd997806fa1de0bb61436844c809b00d865
