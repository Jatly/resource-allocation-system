import { BrowserRouter, Route, Routes } from "react-router-dom";
import Ct from "./components/ct";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Booking from "./components/Booking";
import Addresource from "./components/Addresource";
import Editresource from "./components/Editresource";
import Resetpassword from "./components/Resetpassword";
import Logout from "./components/Logout";
import Cookies from "js-cookie";
import BookingHistory from "./components/BookingHistory";

const App = () => {
  let [state, setState] = useState({ token: "", role: "", name: "", uid: "" });
  let updstate = (data) => {
    setState({ ...state, ...data });
  };

  useEffect(() => {
    const cookieData = Cookies.get("loginDetails");
    if (cookieData) {
      updstate(JSON.parse(cookieData));
    }
  }, []);

  let obj = { state: state, updstate: updstate };
  return (
    <BrowserRouter>
      <Ct.Provider value={obj}>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/booknow/:id" element={<Booking />} />
          <Route path="/addresource" element={<Addresource />} />
          <Route path="/editresources/:id" element={<Editresource />} />{" "}
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/history" element={<BookingHistory />} />
        </Routes>
        <Footer />
      </Ct.Provider>
    </BrowserRouter>
  );
};

export default App;
