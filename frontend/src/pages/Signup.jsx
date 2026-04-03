import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Signup() {
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    phone: "", branch: "", year: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { username, email, password, phone, branch, year } = form;
    if (!username || !email || !password || !phone || !branch || !year) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("https://uni-rent-backend.onrender.com/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, year: parseInt(form.year) }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user_id", data.user_id);
      navigate("/dashboard");
    } else {
      const firstError = Object.values(data)[0];
      setError(Array.isArray(firstError) ? firstError[0] : firstError);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-box">
          <h2>Create Account</h2>
          <p>Join UniRent — rent smarter, share easier</p>

          <div className="form-group">
            <input name="username" placeholder="Username" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <div className="form-row">
              <input name="branch" placeholder="Branch (e.g. CSE)" onChange={handleChange} />
              <input name="year" type="number" placeholder="Year (1-4)" min="1" max="4" onChange={handleChange} />
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: "14px", marginBottom: "12px" }}>{error}</p>}

          <button className="btn primary" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;