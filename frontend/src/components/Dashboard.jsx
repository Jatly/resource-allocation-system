import { useContext, useEffect } from "react";
import Bookingstoday from "./Bookingstoday";
import { useNavigate } from "react-router-dom";
import Ct from "./ct";
import Cookies from "js-cookie";
import Resourceavailable from "./Resourceavailable";

const Dashboard = () => {
  const navigate = useNavigate();
  const obj = useContext(Ct);

  useEffect(() => {
    const data = Cookies.get("loginDetails");

    // ❌ No cookie → redirect
    if (!data) {
      navigate("/login");
      return;
    }

    // ✅ Restore state if missing
    if (data && !obj?.state?.role) {
      obj.updstate(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4 sm:p-6">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Today's Bookings */}
    <div className="bg-[#161B22] rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <h2 className="text-lg sm:text-xl font-semibold text-[#58a6ff] mb-4">
        Today's Bookings
      </h2>
      <Bookingstoday />
    </div>

    {/* Available Resources */}
    <div className="bg-[#161B22] rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <h2 className="text-lg sm:text-xl font-semibold text-[#58a6ff] mb-4">
        Available Resources
      </h2>
      <Resourceavailable />
    </div>

  </div>

</div>
  );
};

export default Dashboard;
