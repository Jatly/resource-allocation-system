import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Addresource = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: {
      floor: "",
      roomNumber: "",
    },
    amenities: "",
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
    description: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [section]: {
        ...data[section],
        [name]: value,
      },
    });
  };

  const handleSubmit = async () => {
    if (
      !data.name ||
      !data.type ||
      !data.capacity ||
      !data.location.floor ||
      !data.location.roomNumber
    ) {
      return setMsg("Please fill all required fields.");
    }

    try {
      const formattedData = {
        ...data,
        capacity: Number(data.capacity),
        amenities: data.amenities
          ? data.amenities.split(",").map((a) => a.trim())
          : [],
      };

      const res = await axios.post(
        "https://resource-allocation-system.onrender.com/addresource",
        formattedData,
      );

      setMsg(res.data.msg || "Resource added successfully");

      setData({
        name: "",
        type: "",
        capacity: "",
        location: { floor: "", roomNumber: "" },
        amenities: "",
        workingHours: { start: "09:00", end: "18:00" },
        description: "",
      });

      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error adding resource");
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] to-[#161B22] px-4">

  <div className="w-full max-w-2xl p-6 sm:p-8 bg-[#0D1117] rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)] flex flex-col gap-5">

    {/* Title */}
    <h2 className="text-xl sm:text-2xl font-semibold text-center text-white">
      Add Resource
    </h2>

    {/* Message */}
    {msg && (
      <p className="text-center text-red-400 text-sm">
        {msg}
      </p>
    )}

    {/* Form */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Name *</label>
        <input
          name="name"
          value={data.name}
          onChange={handleChange}
          className="h-11 px-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Type *</label>
        <select
          name="type"
          value={data.type}
          onChange={handleChange}
          className="h-11 px-3 rounded-md bg-[#0D1117] border border-white text-white focus:border-[#58a6ff] outline-none"
        >
          <option value="">Select Type</option>
          <option value="meeting_room">Meeting Room</option>
          <option value="conference_hall">Conference Hall</option>
          <option value="training_room">Training Room</option>
          <option value="private_room">Private Room</option>
        </select>
      </div>

      {/* Capacity */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Capacity *</label>
        <input
          name="capacity"
          type="number"
          value={data.capacity}
          onChange={handleChange}
          className="h-11 px-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none"
        />
      </div>

      {/* Floor */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Floor *</label>
        <input
          name="floor"
          value={data.location.floor}
          onChange={(e) => handleNestedChange(e, "location")}
          className="h-11 px-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none"
        />
      </div>

      {/* Room Number */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Room Number *</label>
        <input
          name="roomNumber"
          value={data.location.roomNumber}
          onChange={(e) => handleNestedChange(e, "location")}
          className="h-11 px-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none"
        />
      </div>

      {/* Amenities */}
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-xs text-gray-400">Amenities</label>
        <input
          name="amenities"
          placeholder="e.g. Projector, AC, Whiteboard"
          value={data.amenities}
          onChange={handleChange}
          className="h-11 px-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-xs text-gray-400">Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          className="p-3 rounded-md bg-transparent border border-white text-white focus:border-[#58a6ff] outline-none min-h-[100px]"
        />
      </div>

    </div>

    {/* Button */}
    <button
      onClick={handleSubmit}
      className="mt-2 h-11 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-md font-medium hover:scale-[1.02] transition"
    >
      Update Resource
    </button>

  </div>
</div>
  );
};

export default Addresource;
