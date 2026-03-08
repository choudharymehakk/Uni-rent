import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo">
        Uni<span>Rent</span>
      </Link>
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="btn ghost sm">Browse</Link>
            <Link to="/my-items" className="btn ghost sm">My Items</Link>
            <Link to="/my-bookings" className="btn ghost sm">My Bookings</Link>
            <Link to="/incoming-requests" className="btn ghost sm">Requests</Link>
            <Link to="/add-item" className="btn primary sm">+ List Item</Link>
            <button className="btn ghost sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost sm">Login</Link>
            <Link to="/signup" className="btn primary sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;