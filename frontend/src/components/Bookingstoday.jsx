import axios from "axios";
import { useEffect, useState } from "react";

const Bookingstoday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch bookings
  useEffect(() => {
    axios
      .get("http://localhost:5000/getbookings")
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const today = new Date().toDateString();

const filteredData = data.filter(
  (item) => new Date(item.startTime).toDateString() === today
);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="booking-container">
      <h2>Today's Bookings</h2>

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
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td>
                  {new Date(item.endTime).toLocaleString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td>
                  <span className={`status ${item.status}`}>{item.status}</span>
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
