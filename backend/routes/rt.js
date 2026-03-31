let express = require("express");
const { signup, login, sendotp, resetpassword, getusername } = require("../controllers/authController");
const {createResources, getResources, getResource, updateResources, deleteResource, getresourcename} = require("../controllers/resourceController");
const { createBooking, getBookings, getBooking, cancelBooking } = require("../controllers/bookingController");
let rt = new express.Router();

rt.post("/signup", signup);
rt.post("/login", login);
rt.get("/sendotp/:email",sendotp)
rt.post("/reset",resetpassword)
rt.get("/getusername/:id",getusername)

rt.post("/addresource",createResources)
rt.get("/getresources",getResources)
rt.get("/getresource/:id",getResource)
rt.put("/updateresources/:id",updateResources)
rt.delete("/deleteresource/:id",deleteResource)
rt.get("/getresourcename/:id",getresourcename)


rt.post("/createbooking/:id",createBooking)
rt.get("/getbookings",getBookings)
rt.get("/getbooking/:id",getBooking)
rt.put("/cancelbooking/:id",cancelBooking)





module.exports = rt;
