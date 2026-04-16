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
    <div className="p-4 sm:p-6">

  {data.length === 0 ? (
    <p className="text-center text-gray-400 text-sm">
      No resources available
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {data.map((resource) => (
        <div
          key={resource._id}
          className="bg-[#161B22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-3 transition hover:border-[#58a6ff] hover:-translate-y-1"
        >

          {/* Title */}
          <h3 className="text-base font-semibold text-[#e6edf3]">
            {resource.name}
          </h3>

          {/* Details */}
          <div className="text-sm text-[#9da7b3] space-y-1">
            <p>Capacity: {resource.capacity}</p>
            <p>
              Location: {resource.location.floor} floor,{" "}
              {resource.location.roomNumber}
            </p>
            <p>Type: {resource.type}</p>
          </div>

          {/* Status */}
          <span
            className={`w-fit px-3 py-1 rounded-full text-xs font-semibold
              ${
                resource.status === "available"
                  ? "bg-[rgba(46,160,67,0.15)] text-[#3fb950]"
                  : "bg-[rgba(248,81,73,0.15)] text-[#f85149]"
              }`}
          >
            {resource.status}
          </span>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2">

            {resource.status === "available" && (
              <button
                onClick={() => navigate(`/booknow/${resource._id}`)}
                className="flex-1 min-w-[100px] h-9 bg-[#238636] text-white rounded-md hover:bg-[#2ea043] transition text-sm"
              >
                Book
              </button>
            )}

            {obj?.state?.role === "admin" && (
              <button
                onClick={() => navigate(`/editresources/${resource._id}`)}
                className="flex-1 min-w-[100px] h-9 border border-[#30363d] text-[#c9d1d9] rounded-md hover:border-[#58a6ff] hover:text-[#58a6ff] transition text-sm"
              >
                Edit
              </button>
            )}

            {obj?.state?.role === "admin" && (
              <button
                onClick={() => {
                  axios
                    .delete(
                      "https://resource-allocation-system.onrender.com/deleteresource/" +
                        resource._id
                    )
                    .then((res) => {
                      alert(res.data.msg);
                      window.location.reload();
                    })
                    .catch((err) => {
                      alert(err.response?.data?.msg || "Error");
                    });
                }}
                className="flex-1 min-w-[100px] h-9 border border-[#f85149] text-[#f85149] rounded-md hover:bg-[#f85149] hover:text-white transition text-sm"
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
