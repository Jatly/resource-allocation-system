import React, { useContext, useEffect } from "react";
import Ct from "./ct";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const obj = useContext(Ct);
  const navigate = useNavigate();

  useEffect(() => {
    // clear state
    obj.updstate({ token: "", name: "", role: "", email: "" });

    // clear cookie
    Cookies.remove("loginDetails");

    // redirect
    navigate("/login");
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
