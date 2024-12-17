import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AllPlayers from "./AllPlayers";
import SoldPlayers from "./SoldPlayers";
import UnsoldPlayers from "./UnsoldPlayers";
import TeamWisePlayers from "./TeamWisePlayers";
import "../styles/HomePage.css";
import SlabWisePlayers from "./SlabWisePlayers";
import Navbar from "./Navbar";

const HomePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "all"
  );

  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <h1
          style={{
            fontSize: "32px",
            borderRadius: "15px",
            backgroundColor: "black",
            color: "WHITE",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
          className="homepage-title"
        >
          AUCTION DASHBOARD
        </h1>
        <div className="button-group">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All Players
          </button>
          <button
            className={activeTab === "sold" ? "active" : ""}
            onClick={() => setActiveTab("sold")}
          >
            Sold Players
          </button>
          <button
            className={activeTab === "unsold" ? "active" : ""}
            onClick={() => setActiveTab("unsold")}
          >
            Unsold Players
          </button>
          <button
            className={activeTab === "teamwiseplayers" ? "active" : ""}
            onClick={() => setActiveTab("teamwiseplayers")}
          >
            Players by Team
          </button>
          <button
            className={activeTab === "slabwiseplayers" ? "active" : ""}
            onClick={() => setActiveTab("slabwiseplayers")}
          >
            Players by Slab
          </button>
        </div>

        <div>
          {activeTab === "all" && <AllPlayers />}
          {activeTab === "sold" && <SoldPlayers />}
          {activeTab === "unsold" && <UnsoldPlayers />}
          {activeTab === "teamwiseplayers" && <TeamWisePlayers />}
          {activeTab === "slabwiseplayers" && <SlabWisePlayers />}
        </div>
      </div>
    </>
  );
};

export default HomePage;
