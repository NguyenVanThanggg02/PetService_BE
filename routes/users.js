
import createError from "http-errors";
import User from "../models/user.js";
import express from "express";
import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../helpers/jwt_helper.js";
import { userController } from "../controllers/index.js";
import jwt from "jsonwebtoken";

const usersRouter = express.Router();
usersRouter.get('/',userController.getAllUsers)
usersRouter.put('/:username',userController.updateUser)
usersRouter.get("/:username", userController.getUserByUserName);
// change password
usersRouter.put("/changepass/:username", userController.changePass);
usersRouter.post("/forgot-password", userController.forgetPass);

usersRouter.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
});



usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) throw createError(404, "Không tìm thấy người dùng");
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// usersRouter.get("/:username", verifyAccessToken, async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const user = await User.findOne({ username: username }).exec();
//     if (!user) throw createError(404, `Người dùng ${username} không tồn tại`);
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw createError.BadRequest("Yêu cầu nhập tên người dùng và mật khẩu");
    }
    const existingUser = await User.findOne({ username: username }).exec();
    if (existingUser) throw createError.Conflict("Người dùng đã tồn tại");
    const hashPass = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SECRET)
    );
    const newUser = new User({ username, password: hashPass });
    const savedUser = await newUser.save();
    const accessToken = await signAccessToken(savedUser._id);
    res.send({ accessToken, newUser });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }).exec();
    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw createError.Unauthorized("Username or password is incorrect");

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    res
      .status(200)
      .json({
        username: user.username,
        accessToken,
        refreshToken,
        password: user.password,
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      });
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/logout", async (req, res, next) => {
  res.send("Đường dẫn Đăng xuất");
});

usersRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      throw createError.BadRequest("Refresh token không hợp lệ");
    const userId = await verifyRefreshToken(refreshToken);
    if (userId) {
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: newRefreshToken });
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
