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
    <div className="dashboard">
      <div className="dashboard-section">
        <h2>Today's Bookings</h2>
        <Bookingstoday />
      </div>

      <div className="dashboard-section">
        <h2>Available Resources</h2>
        <Resourceavailable />
      </div>
    </div>
  );
};

export default Dashboard;
