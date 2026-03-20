let express = require("express");
const { signup, login, sendotp, resetpassword } = require("../controllers/authController");
let rt = new express.Router();
rt.post("/signup", signup);
rt.post("/login", login);
rt.get("/sendotp/:email",sendotp)
rt.post("/reset",resetpassword)
module.exports = rt;
