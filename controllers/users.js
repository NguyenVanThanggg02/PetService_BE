import { userDao } from "../dao/index.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import User from "../models/user.js";

const getAllUsers = async (req, res) => {
  try {
    const allUser = await userDao.fetAllUser();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const updateUser = async (req, res) => {
  try {
    res
      .status(200)
      .json(await userDao.updateUser(req.params.username, req.body));
    console.log("Edit user successfully");
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
    console.log("Edit user failed");
  }
};
const getUserByUserName = async (req, res) => {
  try {
    const username = await userDao.fetchUserByUsername(req.params.username);
    res.status(200).json(username);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const forgetPass = async (req, res) => {
  const { gmail } = req.body;
  try {
    const user = await userDao.forgotPass(gmail);
    if (!user) {
      return res.send({ Status: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thang2k210@gmail.com",
        pass: "bqvh osxx crfn giai",
      },
    });

    var mailOptions = {
      from: "thang2k210@gmail.com",
      to: gmail,
      subject: "Reset your password link",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ Status: "Error sending email" });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.send({ Status: "Error", Error: error.message });
  }
};

const changePass = async (req, res) => {
  try {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
export default {
  getAllUsers,
  forgetPass,
  changePass,
  updateUser,
  getUserByUserName,
};
