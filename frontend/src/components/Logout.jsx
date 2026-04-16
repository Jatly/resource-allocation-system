import React, { useContext, useEffect } from "react";
import Ct from "./ct";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const obj = useContext(Ct);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // clear state
      obj.updstate({ token: "", name: "", role: "", uid: "" });

      // clear cookie
      Cookies.remove("loginDetails");

      // redirect
      navigate("/login");
    }, 1500); //  small delay for UX

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] to-[#161B22] px-4">

      <div className="bg-[#161B22] border border-[#30363d] rounded-xl p-8 flex flex-col items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-[#238636] border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-white text-sm sm:text-base">
          Logging you out...
        </p>

      </div>

    </div>
  );
};

export default Logout;