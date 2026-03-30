const Resources = require("../models/Resources");
const Bookings = require("../models/Bookings");

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;

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

    //Prevent Booking Conflict Logic

    const conflict = await Bookings.findOne({
      resource,
      status: "confirmed",
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });
    if (conflict) {
      return res.json({
        msg: "Time slot already booked",
      });
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

let getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find()
      .populate("resource", "name")
      .populate("user", "name");
    res.json(bookings);
  } catch(err){
    console.log(err);
    res.json({ msg: "Error fetching bookings" });
  }
};

let getBooking = async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id)
      .populate("resource", "name")
      .populate("user", "name");
    console.log(booking);

    if (!booking) {
      res.json({ msg: "Booking not found" });
    } else {
      res.json(booking);
    }
  } catch {
    res.json({ msg: "Error in fetching the booking" });
  }
};

let cancelBooking = async (req, res) => {
  try {
    //  populate userModel (IMPORTANT)
    const booking = await Bookings.findById(req.params.id).populate(
      "user",
      "name email",
    );

    // 1. Check booking
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: "Booking not found",
      });
    }

    //  Check status
    if (booking.status == "cancelled") {
      return res.json({
        msg: "Booking already cancelled",
      });
    }

    // 2. Cancel booking
    booking.status = "cancelled";
    await booking.save();

    // 3. Send email 📧
    const message = `
Hi ${booking.user.name},

Due to an emergency, your booking has been cancelled.

You can:
• Reschedule for a different time
• Choose another meeting room

Sorry for the inconvenience.

Regards,
Office Team
`;

    await sendEmail(booking.user.email, "Booking Cancelled", message);

    // 4. Response
    res.status(200).json({
      success: true,
      msg: "Booking cancelled and email sent",
      booking,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      msg: "Error in cancelling booking",
    });
  }
};

module.exports = { cancelBooking };

module.exports = { createBooking, getBookings, getBooking, cancelBooking };
