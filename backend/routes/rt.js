let express = require("express");
const { signup, login } = require("../controllers/authController");
let rt = new express.Router();
rt.post("/signup", signup);
rt.post("/login", login);

module.exports = rt;
