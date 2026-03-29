import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Ct from "./ct";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  let obj = useContext(Ct);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const log = () => {
    if (!data.email || !data.password) {
      setMsg("All fields are required");
      return;
    }
    setMsg("");
    axios
      .post("http://localhost:5000/login", data)
      .then((res) => {
        if (res.data.token !== undefined) {
          obj.updState({ token: res.data.token, name: res.data.name });
          navigate("/");
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
    <div className="register">
      <div className="register-box">
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={log}>Login</button>

        <div className="auth-link forgot-password"
          onClick={() => navigate("/resetpassword")}>
          Forgot your password?</div>

        <div className="auth-link signup-link"
          onClick={() => navigate("/signup")}>
            Don’t have an account?</div>
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default Login;
