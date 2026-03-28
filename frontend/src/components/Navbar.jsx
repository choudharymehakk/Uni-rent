import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="nav-logo">
        <Link to="/">UniRent</Link>
      </div>

      <div className="nav-right">

        {/* If user NOT logged in */}
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn primary">
              Sign Up
            </Link>
          </>
        )}

        {/* If user logged in */}
        {token && (
          <>
            <Link to="/dashboard">Browse</Link>
            <Link to="/profile">Profile</Link>

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
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;