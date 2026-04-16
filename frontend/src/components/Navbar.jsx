import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Ct from "./ct";

const Navbar = () => {
  let obj = useContext(Ct);
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = "hover:text-black transition";

  return (
    <nav className="w-full bg-[#238636] px-5 py-3 flex items-center justify-between text-[#e6edf3] relative">

      {/* Logo */}
      <h2 className="text-lg font-semibold tracking-wide">
        WorkHive
      </h2>

      {/* Hamburger (mobile) */}
      <div
        className="md:hidden cursor-pointer text-xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* Links */}
      <div
        className={`absolute md:static top-full left-0 w-full md:w-auto bg-[#238636] md:bg-transparent flex flex-col md:flex-row items-center gap-4 text-sm transition-all duration-300 ${
          menuOpen ? "flex py-4" : "hidden md:flex"
        }`}
      >
        {obj.state.token == "" ? (
          <>
            <Link to="/login" className={linkStyle}>
              Login
            </Link>

            <Link to="/signup" className={linkStyle}>
              Sign-up
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={linkStyle}>
              Home
            </Link>

            {obj.state.role === "admin" && (
              <Link to="/addresource" className={linkStyle}>
                Add Resource
              </Link>
            )}

            <Link to="/history" className={linkStyle}>
              History
            </Link>

            <Link to="/logout" className={linkStyle}>
              Logout
            </Link>

            <h4 className="px-3 py-1 bg-black/20 rounded-full text-xs">
              {obj.state.name}
            </h4>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;