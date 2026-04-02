import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Editresource = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: { floor: "", roomNumber: "" },
    amenities: "",
    workingHours: { start: "09:00", end: "18:00" },
    description: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/getresource/${id}`)
      .then((res) => {
        const r = res.data.resource;
        console.log("API DATA:", res.data); // 👈 ADD THIS

        setData({
          name: r.name || "",
          type: r.type || "",
          capacity: r.capacity || "",
          location: r.location || { floor: "", roomNumber: "" },
          amenities: r.amenities?.join(", ") || "",
          workingHours: r.workingHours || { start: "09:00", end: "18:00" },
          description: r.description || "",
        });
      })
      .catch(() => {
        setMsg("Failed to load resource.");
      });
  }, [id]);

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

  const handleUpdate = async () => {
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

      const res = await axios.put(
        `http://localhost:5000/updateresources/${id}`,
        formattedData,
      );

      setMsg(res.data.msg || "Resource updated successfully.");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error updating resource.");
    }
  };

  return (
    <div className="add-resource">
      <h2>Edit Resource</h2>

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
      <input
        name="capacity"
        type="number"
        value={data.capacity}
        onChange={handleChange}
      />

      <label>Floor *</label>
      <input
        name="floor"
        value={data.location.floor}
        onChange={(e) => handleNestedChange(e, "location")}
      />

      <label>Room Number *</label>
      <input
        name="roomNumber"
        value={data.location.roomNumber}
        onChange={(e) => handleNestedChange(e, "location")}
      />

      <label>Amenities</label>
      <input
        name="amenities"
        placeholder="e.g. Projector, AC, Whiteboard"
        value={data.amenities}
        onChange={handleChange}
      />

      <label>Description</label>
      <textarea
        name="description"
        value={data.description}
        onChange={handleChange}
      />

      <button onClick={handleUpdate}>Update Resource</button>
    </div>
  );
};

export default Editresource;
