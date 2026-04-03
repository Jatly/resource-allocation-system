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
 <div className="add-resource">
  <h2>Add Resource</h2>

  {msg && <p>{msg}</p>}

  <label>Name *</label>
  <input name="name" value={data.name} onChange={handleChange} />

  <label>Type *</label>
  <select name="type" value={data.type} onChange={handleChange}>
    <option value="">Select Type</option>
    <option value="meeting_room">Meeting Room</option>
    <option value="conference_hall">Conference Hall</option>
    <option value="training_room">Training Room</option>
    <option value="private_room">Private Room</option>
  </select>

  <label>Capacity *</label>
  <input name="capacity" type="number"
    value={data.capacity} onChange={handleChange} />

  <label>Floor *</label>
  <input name="floor"
    value={data.location.floor}
    onChange={(e) => handleNestedChange(e, "location")} />

  <label>Room Number *</label>
  <input name="roomNumber"
    value={data.location.roomNumber}
    onChange={(e) => handleNestedChange(e, "location")} />

  <label>Amenities</label>
  <input name="amenities"
    placeholder="e.g. Projector, AC, Whiteboard"
    value={data.amenities}
    onChange={handleChange} />

  <label>Working Hours Start</label>
  <input type="time" name="start"
    value={data.workingHours.start}
    onChange={(e) => handleNestedChange(e, "workingHours")} />

  <label>Working Hours End</label>
  <input type="time" name="end"
    value={data.workingHours.end}
    onChange={(e) => handleNestedChange(e, "workingHours")} />

  <label>Description</label>
  <textarea name="description"
    value={data.description}
    onChange={handleChange} />

  <button onClick={handleSubmit}>Update Resource</button>
</div>
  );
};

export default Addresource;
