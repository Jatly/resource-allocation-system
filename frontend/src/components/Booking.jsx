import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Ct from "./ct";
const Booking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  let obj = useContext(Ct)
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
    // 🔥 CONVERT TO UTC BEFORE SENDING
    const startUTC = new Date(data.startTime).toISOString();
    const endUTC = new Date(data.endTime).toISOString();

    const res = await axios.post(
      `https://resource-allocation-system.onrender.com/createbooking/${id}`,
      {
        purpose: data.purpose,
        startTime: startUTC,  // ✅ FIXED
        endTime: endUTC,      // ✅ FIXED
        user: obj.state.uid,
      }
    );

    setMsg(res.data.msg);
    navigate("/");
  } catch (err) {
    setMsg(err.response?.data?.msg || "Error");
  }
};
  return (
    <div className="booking-wrapper">
  <div className="booking-card">
    <h2>Book Resource</h2>

    {msg && <p className="booking-msg">{msg}</p>}

    <div className="input-group">
      <label>Purpose</label>
      <input
        type="text"
        name="purpose"
        placeholder="e.g. Team Meeting"
        value={data.purpose}
        onChange={handleChange}
      />
    </div>

    <div className="input-group">
      <label>Start Time</label>
      <input
        type="datetime-local"
        name="startTime"
        value={data.startTime}
        onChange={handleChange}
      />
    </div>

    <div className="input-group">
      <label>End Time</label>
      <input
        type="datetime-local"
        name="endTime"
        value={data.endTime}
        onChange={handleChange}
      />
    </div>

    <button onClick={booknow}>Confirm Booking</button>
  </div>
</div>
  );
};

export default Booking;