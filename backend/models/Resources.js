const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["meeting_room", "conference_hall", "training_room", "private_room"],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    location: {
      floor: Number,
      roomNumber: String,
    },

    amenities: [String], // ["Projector", "Whiteboard", "AC"]

    status: {
      type: String,
      enum: ["available", "maintenance"],
      default: "available",
    },

    workingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "18:00",
      },
    },

    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);