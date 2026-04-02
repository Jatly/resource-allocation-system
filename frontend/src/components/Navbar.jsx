import { useContext } from "react";
import { Link } from "react-router-dom";
import Ct from "./ct";

const Navbar = () => {
  let obj = useContext(Ct);
  console.log(obj);

  return (
    <nav>
      <h2>WorkHive</h2>

      <div className="links">
        {obj.state.token == "" ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign-up</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            {obj.state.role === "admin" && (
              <Link to="/addresource">Add Resource</Link>
            )}
            <Link to="/history">History</Link>
            <Link to="/logout">Logout</Link>
            <h4>{obj.state.name}</h4>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
