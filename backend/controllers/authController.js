const { JsonWebTokenError } = require("jsonwebtoken");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

module.exports = { signup, login };
