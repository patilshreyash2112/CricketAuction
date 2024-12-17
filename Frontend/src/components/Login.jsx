import React, { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/Login.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./Navbar";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error messages
  const [loading, setLoading] = useState(false); // Loading state to show spinner or disable button
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in both username and password");
      return;
    }

    try {
      setLoading(true); // Set loading state to true when login starts
      const response = await loginUser({ username, password });

      if (response.success) {
        console.log("Login successful");

        // Save user session data (such as user_id) to localStorage
        localStorage.setItem("user_id", response.user.user_id); // Store user_id in localStorage
        localStorage.setItem("user", JSON.stringify(response.user)); // Save other user details if needed
        localStorage.setItem("token", response.token); // Save token if applicable

        // Redirect to the AuctionList page
        navigate("/auctions"); // Change the route to match your AuctionList page
        setError(""); // Clear error messages
      } else {
        setError(response.message || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-form-container">
        <h1 style={{ marginBottom: "10px" }}>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button
          style={{ marginTop: "20px" }}
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error">{error}</div>}{" "}
        {/* Display error if exists */}
        <p style={{ marginTop: "10px" }} className="register-text">
          Don't have an account?{" "}
          <Link to="/users/register" className="register-link">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
