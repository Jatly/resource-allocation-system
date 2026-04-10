import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Ct from "./ct";

const Bookingstoday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let obj=useContext(Ct)

  useEffect(() => {
    axios
      .get("https://resource-allocation-system.onrender.com/getbookings")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const today = new Date().toDateString();

  const filteredData = data.filter(
    (item) => new Date(item.startTime).toDateString() === today,
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="booking-container">
      {filteredData.length === 0 ? (
        <p>No bookings today</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Purpose</th>
              <th>Resource</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.user?.name || "—"}</td>

                <td>{item.purpose}</td>

                <td>{item.resource?.name || "—"}</td>
                <td>
                  {new Date(item.startTime).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td>
                  {new Date(item.startTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td>
                  {new Date(item.endTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td>
                  <span className={`status ${item.status}`}>{item.status}</span>
                  {obj.state.role==="admin" && item.status === "confirmed" && (
              <button className="cancel-btn" onClick={()=>{
                axios.put("https://resource-allocation-system.onrender.com/cancelbooking/"+item._id).then((res)=>{
                  alert(res.data.msg)
                  window.location.reload()
                }).catch((err)=>{
                  alert(err.response?.data?.msg || "Error")
                })
              }}>
                Cancel Booking
              </button>
            )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bookingstoday;
