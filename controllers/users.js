import { userDao } from "../dao/index.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userDao.fetchAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userDao.updateUser(req.params.username, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgetPass = async (req, res) => {
  const { gmail } = req.body;
  try {
    const user = await userDao.forgotPass(gmail);
    if (!user) {
      return res.status(404).send({ Status: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Reset your password link",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ Status: "Error sending email" });
      }
      res.send({ Status: "Success" });
    });
  } catch (error) {
    res.status(500).send({ Status: "Error", Error: error.message });
  }
};

const changePass = async (req, res) => {
  try {
    const { username } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ status: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    console.log("Username:", req.params.username);
    const getUser = await User.findOne({ username: req.params.username }).exec();
    if (!getUser) {
      return res.status(404).send({ error: `${req.params.username} not found` });
    }
    res.send(getUser);
  } catch (error) {
    next(error);
  }
};

export default { getAllUsers, forgetPass, changePass, updateUser, getUserByUsername };
