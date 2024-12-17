import React from "react";
import "../styles/Navbar.css"; // Assuming you will create a separate CSS file for styling

const Navbar = () => {
  return (
    <center>
      <nav style={{ alignItems: "center" }} className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">IPL Auction 2025</h1>
        </div>
      </nav>
    </center>
  );
};

export default Navbar;
