import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const reg = () => {
    if (!data.name || !data.email || !data.password) {
      setMsg("All fields are required");
      return;
    }

    setMsg("");

    axios
      .post("https://resource-allocation-system.onrender.com/signup", data)
      .then((res) => {
        if (res.data.msg === "Account created") {
          navigate("/login");
        } else {
          setMsg(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg("Something went wrong");
      });
  };
  return (
   <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] to-[#161B22] px-4">

  <div className="w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8 bg-[#0D1117] rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)] flex flex-col gap-5">

    <h2 className="text-xl sm:text-2xl text-white font-semibold text-center">
      Register
    </h2>

    {/* Inputs */}
    <div className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full h-11 px-3 bg-transparent border border-white rounded-md text-white placeholder-gray-400 focus:border-[#58a6ff] outline-none transition"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full h-11 px-3 bg-transparent border border-white rounded-md text-white placeholder-gray-400 focus:border-[#58a6ff] outline-none transition"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full h-11 px-3 bg-transparent border border-white rounded-md text-white placeholder-gray-400 focus:border-[#58a6ff] outline-none transition"
      />
    </div>

    {/* Button */}
    <button
      onClick={reg}
      className="w-full h-11 bg-white text-[#0D1117] rounded-md hover:bg-transparent hover:text-white hover:border hover:border-white transition"
    >
      Register
    </button>

    {/* Message */}
    {msg && (
      <p className="text-red-400 text-sm text-center">
        {msg}
      </p>
    )}

    {/* Link */}
    <div className="text-center text-sm sm:text-base">
      <span
        onClick={() => navigate("/login")}
        className="cursor-pointer hover:underline text-gray-300"
      >
        Already have an account?
      </span>
    </div>

  </div>
</div>
  );
};

export default Register;
