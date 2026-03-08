import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (

    <nav className="navbar">

      <div className="nav-logo">
        <Link to="/dashboard">UniRent</Link>
      </div>

      <div className="nav-right">

        <Link to="/dashboard">Browse</Link>

        <Link to="/my-items">My Items</Link>

        <Link to="/requests">Requests</Link>

        <Link to="/my-bookings">My Bookings</Link>

        <Link to="/scan">Scan QR</Link>

        <Link to="/add-item" className="btn primary">
          + List Item
        </Link>

        <button className="btn secondary" onClick={logout}>
          Logout
        </button>

      </div>

    </nav>

  );
}

export default Navbar;