const { JsonWebTokenError } = require("jsonwebtoken");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.json({ msg: "all feilds are required" });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      res.json({ msg: "user already exists" });
    }
    let hash = await bcrypt.hash(req.body.password, 10);
    let data = new userModel({ name, email, password: hash });
    await data.save();
    res.json({ msg: "account created" });
  } catch (err) {
    res.json(err);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      res.json({ msg: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ msg: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "12345",
      { expiresIn: "1d" },
    );
    res.json({ mag: "Login succesful", token, name: user.name });
  } catch (err) {
    res.json(err);
  }
};

let sendotp = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ msg: "user not found" }); // ✅ return added
    }

    const otp = Math.round(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const info = await transporter.sendMail({
      from: '"Resource-Allocation" <jatly.aj.29@gmail.com>',
      to: user.email,
      subject: "🔐 Reset Your Password - OTP Inside",
      text: `Hey there,

We received a request to reset your password.

Your One-Time Password (OTP) is: ${otp}

⏳ This OTP is valid for 10 minutes.
🔒 Please do not share this code with anyone.

If you didn’t request this, you can safely ignore this email.

– Team`,
    });

    if (info.accepted.length > 0) {
      return res.json({ msg: "OTP sent" }); // ✅ return added
    } else {
      return res.json({ msg: "error in sending OTP retry" }); // ✅ return added
    }
  } catch (err) {
    return res.json(err); // ✅ return added
  }
};

let resetpassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.otp != otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (user.otpExpire < Date()) {
      console.log("DB otpExpire:", user.otpExpire);
      console.log("Current time:", Date.now());
      return res.json({ msg: "OTP expired" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return res.json({ msg: "Password reset successful ✅" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { signup, login, sendotp, resetpassword };
