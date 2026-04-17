import { useEffect, useState } from "react";
import axios from "axios";

const BookingHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // 🔍 Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.resource?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#238636] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      {/* 🔍 Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by user, resource, purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 h-10 px-3 rounded-md bg-[#0D1117] border border-[#30363d] text-white text-sm focus:border-[#58a6ff] outline-none"
        />

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md bg-[#0D1117] border border-[#30363d] text-white text-sm focus:border-[#58a6ff] outline-none"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">No bookings found</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <table className="min-w-[700px] w-full bg-[#161B22] text-sm">
            {/* Header */}
            <thead className="bg-[#020617] text-[#238636] uppercase text-xs tracking-wide sticky top-0 ">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Resource</th>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-[#1e293b] hover:bg-[#1e293b] transition even:bg-[#020617]"
                >
                  <td className="p-3">{item.user?.name || "—"}</td>

                  <td className="p-3">{item.resource?.name || "—"}</td>

                  <td className="p-3">{item.purpose}</td>

                  <td className="p-3">
                    {new Date(item.startTime).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-3">
                    {new Date(item.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="p-3">
                    {new Date(item.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium
                      ${
                        item.status === "confirmed"
                          ? "bg-[#238636] text-white"
                          : item.status === "cancelled"
                            ? "bg-[#ef4444] text-white"
                            : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
