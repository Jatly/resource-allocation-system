const Resources = require("../models/Resources");
const Bookings = require("../models/Bookings");

let createBooking = async (req, res) => {
  try {
    const { resource, startTime, endTime, purpose, user } = req.body;

    // Validate input
    if (!resource || !startTime || !endTime) {
      return res.json({ msg: "Missing required feilds" });
    }
    // Validate Time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.json({ msg: "Invalid time range" });
    }

    // check resource exist
    const resourceExists = await Resources.findById(resource);
    if (!resourceExists) {
      return res.json({ msg: "Resource not found" });
    }

    // Checking availability
    if (resourceExists.status !== "available") {
      return res.json({ msg: "Resource not available" });
    }

    //Conflict Check

    const conflict = await Bookings.findOne({
      resource,
      status: "confirmed",
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });
    if (conflict) {
      return res.json({ msg: "Time slot already booked" });
    }

    // create booking

    const booking = await Bookings.create({
      resource,
      startTime,
      endTime,
      purpose,
      user,
    });
    return res.json({ msg: "Booking created succesfully" });
  } catch (err) {
    console.log(err);

    return res.json({ msg: "Error in creating booking" });
  }
};

let getBookings = async(req,res)=>{
  try{
    const bookings=await Bookings.find()
    res.json(bookings)
  }
  catch{
    res.json({"msg":"Error fetching bookings"})
  }
}

let getBooking = async(req,res)=>{
  try{
    const booking=await Bookings.findById(req.params.id)
    console.log(booking)

    if(!booking){
      res.json({"msg":"Booking not found"})
    }
    else{
      res.json(booking)
    }
  }
  catch{
    res.json({"msg":"Error in fetching the booking"})
  }
}

let cancelBooking = async(req,res)=>{
  try{
    const booking = await Bookings.findById(req.params.id)
    if (!booking){
      res.json({"msg":"Booking not found"})
    }
    else{
      booking.status="cancelled"
      await booking.save()
      res.json({"msg":"Booking cancelled"},booking)
    }
  }
  catch{
    res.json({"msg":"Error in cancelling"})
  }
}

module.exports = { createBooking , getBookings, getBooking, cancelBooking};
