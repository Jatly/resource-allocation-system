import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Ct from "./ct";
import { useNavigate } from "react-router-dom";

const Resourceavailable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const navigate = useNavigate();
  const obj = useContext(Ct);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://resource-allocation-system.onrender.com/getresources",
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Delete without reload
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);

      await axios.delete(
        "https://resource-allocation-system.onrender.com/deleteresource/" + id,
      );

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    } finally {
      setDeleteLoading(null);
    }
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <div className="min-h-[150px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#238636] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {data.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">
          No resources available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          {data.map((resource) => (
            <div
              key={resource._id}
              className="bg-[#161B22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4 
  transition-all duration-300 
  hover:border-[#58a6ff] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            >
              {/* 🔥 Header (Title + Status) */}
              <div className="flex justify-between items-start">
                <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">
                  {resource.name}
                </h3>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
      ${
        resource.status === "available"
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
                >
                  {resource.status}
                </span>
              </div>

              {/* 🔥 Details */}
              <div className="text-sm text-[#9da7b3] space-y-1 leading-relaxed">
                <p>Capacity: {resource.capacity}</p>
                <p>
                  Location: {resource.location.floor} floor,{" "}
                  {resource.location.roomNumber}
                </p>
                <p className="capitalize">Type: {resource.type}</p>
              </div>

              {/* 🔥 Actions */}
              <div className="mt-auto pt-4 border-t border-[#30363d] flex flex-row gap-3">
                {resource.status === "available" && (
                  <button
                    onClick={() => navigate(`/booknow/${resource._id}`)}
                    className="w-full h-10 bg-[#238636] text-white rounded-md hover:bg-[#2ea043] hover:scale-[1.02] transition text-sm"
                  >
                    Book
                  </button>
                )}

                {obj?.state?.role === "admin" && (
                  <button
                    onClick={() => navigate(`/editresources/${resource._id}`)}
                    className="w-full h-10 border border-[#30363d] text-[#c9d1d9] rounded-md hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition text-sm"
                  >
                    Edit
                  </button>
                )}

                {obj?.state?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(resource._id)}
                    disabled={deleteLoading === resource._id}
                    className={`w-full h-10 rounded-md text-sm transition
        ${
          deleteLoading === resource._id
            ? "bg-gray-500 cursor-not-allowed"
            : "border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white"
        }`}
                  >
                    {deleteLoading === resource._id ? "Deleting..." : "Delete"}
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
