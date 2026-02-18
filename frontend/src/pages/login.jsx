import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // token save (important)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        alert("Login successful 🎉");

        // later redirect dashboard
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <p>Welcome back to Uni-Rent</p>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn primary" onClick={handleLogin}>
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
