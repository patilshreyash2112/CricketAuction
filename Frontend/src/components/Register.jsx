import React, { useState } from "react";
import { registerUser } from "../services/api";
import "../styles/Register.css"; // Import the CSS file
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
function Register({}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    const user = { username, password };
    try {
      const response = await registerUser(user);
      if (response.success) {
        navigate("/users/login");
      } else {
        console.log("else");
        setError(response.message);
      }
    } catch (err) {
      console.log("error");
      setError("Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-form-container">
        {" "}
        {/* Use a consistent class name for the form container */}
        <h1 style={{ marginBottom: "10px" }}>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <button style={{ marginTop: "20px" }} type="submit">
            Register
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link
            to="/users/login"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Register;
