import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ct from "./ct";
import Cookies from "js-cookie";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const obj = useContext(Ct);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const log = async () => {
    if (!data.email || !data.password) {
      setMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post(
        "https://resource-allocation-system.onrender.com/login",
        data
      );

      if (res.data.token) {
        const userData = {
          token: res.data.token,
          name: res.data.name,
          role: res.data.role,
          uid: res.data.uid,
        };

        obj.updstate(userData);

        Cookies.set("loginDetails", JSON.stringify(userData), {
          expires: 3,
        });

        navigate("/");
      } else {
        setMsg(res.data.msg || "Invalid credentials");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") log();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] to-[#161B22] px-4">

      <div className="w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8 bg-[#0D1117] rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)] flex flex-col gap-5">

        <h2 className="text-xl sm:text-2xl text-white font-semibold text-center">
          Login
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full h-11 px-3 bg-transparent border border-white rounded-md text-white placeholder-gray-400 focus:border-[#58a6ff] outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full h-11 px-3 bg-transparent border border-white rounded-md text-white placeholder-gray-400 focus:border-[#58a6ff] outline-none"
          />
        </div>

        {/* Button */}
        <button
          onClick={log}
          disabled={loading}
          className={`w-full h-11 rounded-md transition flex items-center justify-center gap-2
            ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-white text-[#0D1117] hover:bg-transparent hover:text-white hover:border hover:border-white"
            }`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <div className="flex flex-col items-center gap-2 text-sm sm:text-base">
          <span
            onClick={() => navigate("/resetpassword")}
            className="cursor-pointer hover:underline text-gray-300"
          >
            Forgot your password?
          </span>

          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer hover:underline text-gray-300"
          >
            Don’t have an account?
          </span>
        </div>

        {/* Message */}
        {msg && (
          <p className="text-red-400 text-sm text-center">
            {msg}
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;