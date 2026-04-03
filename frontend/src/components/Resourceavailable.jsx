import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Ct from "./ct";
import { useNavigate } from "react-router-dom";
const Resourceavailable = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("https://resource-allocation-system.onrender.com/getresources")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const navigate = useNavigate();

  let obj = useContext(Ct);
  return (
    <div className="resource-container">
      {data.length === 0 ? (
        <p className="resource-empty">No resources available</p>
      ) : (
        <div className="resource-list">
          {data.map((resource) => (
            <div className="resource-card" key={resource._id}>
              <h3>{resource.name}</h3>
              <p>Capacity: {resource.capacity}</p>
              <p>
                Location: {resource.location.floor} floor,{" "}
                {resource.location.roomNumber}
              </p>
              <p>Type: {resource.type}</p>

              <span className={`resource-status ${resource.status}`}>
                {resource.status}
              </span>

              <div className="resource-actions">
                {resource.status === "available" && (
                  <button
                    className="book-btn"
                    onClick={() => navigate(`/booknow/${resource._id}`)}
                  >
                    Book Now
                  </button>
                )}
                {obj?.state?.role === "admin" && (
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/editresources/${resource._id}`)}
                  >
                    Edit
                  </button>
                )}{" "}
                {obj.state.role === "admin" && (
                  <button
                    className="dlt-btn"
                    onClick={() => {
                      axios
                        .delete(
                          "https://resource-allocation-system.onrender.com/deleteresource/" +
                            resource._id,
                        )
                        .then((res) => {
                          alert(res.data.msg);
                          window.location.reload();
                        })
                        .catch((err) => {
                          alert(err.response?.data?.msg || "Error");
                        });
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resourceavailable;
