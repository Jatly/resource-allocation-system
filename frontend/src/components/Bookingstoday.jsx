import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Ct from "./ct";

const Bookingstoday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const obj = useContext(Ct);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://resource-allocation-system.onrender.com/getbookings",
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

  const today = new Date().toDateString();

  const filteredData = data.filter(
    (item) => new Date(item.startTime).toDateString() === today,
  );

  // 🔥 Cancel without reload
  const handleCancel = async (id) => {
    try {
      setCancelLoading(id);

      await axios.put(
        "https://resource-allocation-system.onrender.com/cancelbooking/" + id,
      );

      // update UI instantly
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "cancelled" } : item,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    } finally {
      setCancelLoading(null);
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
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">No bookings today</p>
      ) : (
        <>
          {/* 📱 MOBILE CARDS */}
          <div className="sm:hidden flex flex-col gap-4">
            {filteredData.map((item) => (
              <div
                key={item._id}
                className="bg-[#161B22] p-4 rounded-xl border border-[#30363d] flex flex-col gap-2"
              >
                <div>
                  <p className="text-xs text-gray-400">User</p>
                  <p className="text-white">{item.user?.name || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Purpose</p>
                  <p className="text-white">{item.purpose}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Resource</p>
                  <p className="text-white">{item.resource?.name || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-white">
                    {new Date(item.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    {" to "}
                    {new Date(item.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`mt-2 px-2 py-1 rounded-md text-xs font-medium w-fit
              ${
                item.status === "confirmed"
                  ? "bg-green-500/20 text-green-400"
                  : item.status === "cancelled"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-400/20 text-yellow-300"
              }`}
                >
                  {item.status}
                </span>

                {/* Cancel button */}
                {obj.state.role === "admin" && item.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(item._id)}
                    disabled={cancelLoading === item._id}
                    className={`mt-2 text-xs px-3 py-1 rounded-md transition
                  ${
                    cancelLoading === item._id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "border border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                  }`}
                  >
                    {cancelLoading === item._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 💻 DESKTOP TABLE */}
          <div className="hidden sm:block w-full overflow-x-auto rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <table className="w-full bg-[#161B22] text-sm">
              <thead className="bg-[#21262d] text-gray-300 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left text-xs">User</th>
                  <th className="px-2 py-2 text-left text-xs">Purpose</th>
                  <th className="px-2 py-2 text-left text-xs">Resource</th>
                  <th className="px-2 py-2 text-left text-xs">Date</th>
                  <th className="px-2 py-2 text-left text-xs">Start</th>
                  <th className="px-2 py-2 text-left text-xs">End</th>
                  <th className="px-2 py-2 text-left text-xs">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#30363d] hover:bg-[#0D1117] transition even:bg-[#020617]"
                  >
                    <td className="px-2 py-2 text-xs">
                      {item.user?.name || "—"}
                    </td>
                    <td className="px-2 py-2 text-xs">{item.purpose}</td>
                    <td className="px-2 py-2 text-xs">
                      {item.resource?.name || "—"}
                    </td>

                    <td className="px-2 py-2 text-xs">
                      {new Date(item.startTime).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-2 py-2 text-xs">
                      {new Date(item.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                    </td>

                    <td className="px-2 py-2 text-xs">
                      {new Date(item.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                    </td>

                    <td className="px-2 py-2 text-xs">
                      <div className="flex flex-col gap-2 items-start">
                        {/* Status */}
                        <span
                          className={`px-2 py-1 rounded text-xs
      ${
        item.status === "confirmed"
          ? "bg-green-500/20 text-green-400"
          : item.status === "cancelled"
            ? "bg-red-500/20 text-red-400"
            : "bg-yellow-400/20 text-yellow-300"
      }`}
                        >
                          {item.status}
                        </span>

                        {/* Cancel button */}
                        {obj.state.role === "admin" &&
                          item.status === "confirmed" && (
                            <button
                              onClick={() => handleCancel(item._id)}
                              disabled={cancelLoading === item._id}
                              className={`text-xs px-3 py-1 rounded-md transition
          ${
            cancelLoading === item._id
              ? "bg-gray-500 cursor-not-allowed"
              : "border border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
          }`}
                            >
                              {cancelLoading === item._id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookingstoday;
