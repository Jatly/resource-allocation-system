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

const createBooking = async (req, res) => {
  try {
    const { startTime, endTime, purpose, user } = req.body;
    const resourceId = req.params.id;

    if (!resourceId || !startTime || !endTime || !user) {
      return res.status(400).json({ msg: "Required fields are missing." });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // =============================
    // BUFFER VALIDATION (15 mins)
    // =============================
    const bufferMinutes = 15;
    const minStartTime = new Date(now.getTime() + bufferMinutes * 60000);

    if (start <= minStartTime) {
      return res.status(400).json({
        msg: "Bookings must be made at least 15 minutes in advance.",
      });
    }

    const maxDaysAhead = 7;

    // Max allowed start time (now + 7 days)
    const maxStartTime = new Date(
      now.getTime() + maxDaysAhead * 24 * 60 * 60000,
    );

    if (start > maxStartTime) {
      return res.status(400).json({
        msg: "Bookings can only be made up to 7 days in advance.",
      });
    }

    // =============================
    // TIME RANGE VALIDATION
    // =============================
    if (start >= end) {
      return res.status(400).json({
        msg: "End time must be later than the start time.",
      });
    }

    // =============================
    // MINIMUM DURATION (30 mins)
    // =============================
    const minDuration = 30; // minutes
    const duration = (end - start) / 60000;

    if (duration < minDuration) {
      return res.status(400).json({
        msg: "Minimum booking duration is 30 minutes.",
      });
    }

    // =============================
    // CHECK RESOURCE
    // =============================
    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ msg: "Resource not found." });
    }

    if (resource.status !== "available") {
      return res.status(400).json({
        msg: "The selected resource is currently unavailable.",
      });
    }

    // =============================
    // RESOURCE CONFLICT CHECK
    // =============================
    const conflict = await Bookings.findOne({
      resource: resourceId,
      status: "confirmed",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return res.status(409).json({
        msg: "The selected time slot is already booked.",
      });
    }

    // =============================
    // USER DOUBLE BOOKING CHECK
    // =============================
    const userConflict = await Bookings.findOne({
      user: user,
      status: "confirmed",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (userConflict) {
      return res.status(409).json({
        msg: "You already have a booking during this time.",
      });
    }

    // =============================
    // CREATE BOOKING
    // =============================
    const booking = await Bookings.create({
      resource: resourceId,
      startTime: start,
      endTime: end,
      purpose,
      user,
      status: "confirmed",
    });

    return res.status(201).json({
      msg: "Booking created successfully.",
      booking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "An error occurred while creating the booking.",
    });
  }
};

let getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find()
      .populate("resource", "name")
      .populate("user", "name");
    res.json(bookings);
  } catch (err) {
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
