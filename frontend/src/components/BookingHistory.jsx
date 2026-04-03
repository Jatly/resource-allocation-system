import { useEffect, useState } from "react";
import axios from "axios";

const BookingHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://resource-allocation-system.onrender.com/getbookings")
      .then((res) => {
        console.log(res.data); // debug
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h3 style={{ color: "white", textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Resource</th>
          <th>Purpose</th>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td>{item.user?.name}</td>

            <td>{item.resource?.name}</td>

            <td>{item.purpose}</td>
            <td>{new Date(item.startTime).toLocaleDateString("en-GB")}</td>

            <td>
              {new Date(item.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </td>

            <td>
              {new Date(item.endTime).toLocaleTimeString([], {
                hour: "2-digit",
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
  );
};

export default BookingHistory;
