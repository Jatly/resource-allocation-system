let express = require("express");
const { signup, login, sendotp, resetpassword } = require("../controllers/authController");
const {createResources, getResources, getResource, updateResources, deleteResource} = require("../controllers/resourceController");
const { createBooking } = require("../controllers/bookingController");
let rt = new express.Router();

rt.post("/signup", signup);
rt.post("/login", login);
rt.get("/sendotp/:email",sendotp)
rt.post("/reset",resetpassword)

rt.post("/addresource",createResources)
rt.get("/getresources",getResources)
rt.get("/getresource/:id",getResource)
rt.put("/updateresources/:id",updateResources)
rt.delete("/deleteresource/:id",deleteResource)

rt.post("/createbooking",createBooking)



module.exports = rt;
