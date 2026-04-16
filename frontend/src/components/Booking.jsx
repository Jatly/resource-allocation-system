import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Ct from "./ct";
const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let obj = useContext(Ct);
  const [data, setData] = useState({
    purpose: "",
    startTime: "",
    endTime: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const booknow = async () => {
    if (!data.purpose || !data.startTime || !data.endTime) {
      setMsg("All fields are required");
      return;
    }

    try {

 // Fix timezone bug
 
const startUTC = new 
Date(data.startTime).toISOString();
const endUTC = new 
Date(data.endTime).toISOString();

      const res = await axios.post(
        `https://resource-allocation-system.onrender.com/createbooking/${id}`,
        {
          purpose: data.purpose,
          startTime: startUTC,
          endTime: endUTC,
          user: obj.state.uid,
        },
      );

      setMsg(res.data.msg);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#0d1117,#010409)] px-4">

  <div className="w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8 bg-[#161B22] border border-[#30363d] rounded-xl flex flex-col gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

    {/* Title */}
    <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#58a6ff]">
      Book Resource
    </h2>

    {/* Message */}
    {msg && (
      <p className="text-center text-sm text-[#58a6ff]">
        {msg}
      </p>
    )}

    {/* Form */}
    <div className="flex flex-col gap-4">

      {/* Purpose */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#8b949e]">Purpose</label>
        <input
          type="text"
          name="purpose"
          placeholder="e.g. Team Meeting"
          value={data.purpose}
          onChange={handleChange}
          className="h-11 px-3 rounded-md border border-[#30363d] bg-[#0D1117] text-white text-sm focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 outline-none transition"
        />
      </div>

      {/* Start Time */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#8b949e]">Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={data.startTime}
          onChange={handleChange}
          className="h-11 px-3 rounded-md border border-[#30363d] bg-[#0D1117] text-white text-sm focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 outline-none transition"
        />
      </div>

      {/* End Time */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#8b949e]">End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={data.endTime}
          onChange={handleChange}
          className="h-11 px-3 rounded-md border border-[#30363d] bg-[#0D1117] text-white text-sm focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 outline-none transition"
        />
      </div>

    </div>

    {/* Button */}
    <button
      onClick={booknow}
      className="mt-2 h-11 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-md font-medium hover:-translate-y-1 hover:shadow-lg transition"
    >
      Confirm Booking
    </button>

  </div>
</div>
  );
};

export default Booking;
