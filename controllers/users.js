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
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const userPassword = await User.findOneAndUpdate(
      { username: username },
      { password: password },
      { new: true }
    );
    res.status(200).json({ status: true, data: userPassword });
  } catch (error) {}
};

export default { getAllUsers, forgetPass, changePass };
