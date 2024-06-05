import { userDao } from "../dao/index.js";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
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
    res.status(200).json(await userDao.updateUser(req.params.username, req.body));
    console.log('Edit user successfully');
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
    console.log('Edit user failed');

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



export default {
  getAllUsers,
  updateUser, forgetPass
};


