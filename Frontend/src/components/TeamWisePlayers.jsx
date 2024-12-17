import React, { useEffect, useState } from "react";
import { fetchSoldPlayers } from "../services/api";
import "../styles/TeamWisePlayers.css";

const TeamWisePlayers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchSoldPlayers(); // Fetch all players
      setPlayers(data.filter((p) => p.sold)); // Only show sold players
    };

    loadPlayers();
  }, []);

  const teams = [...new Set(players.map((player) => player.team_name))]; // Get unique teams

  return (
    <>
    <h1>Players by Team</h1>
    <div className="teamwise-players-container">
      {teams.map((team) => (
        <div key={team}>
          <h2 className="team-heading">{team}</h2>
          <div className="player-grid">
            {players
              .filter((player) => player.team_name === team)
              .map((player) => (
                <div
                  key={player.player_id}
                  className={`player-card ${player.sold ? "sold" : "unsold"}`}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuBrvN6FrsGZM6CzHM_Vc0eyxM9EijAjXeTQ&s"
                    alt={player.player_name}
                  />
                  <h3>{player.player_name}</h3>
                  <p>Team: {player.team_name}</p>
                  <p>Slab: {player.slab_name}</p>
                  <p>Base Price: {player.base_price}</p>
                  <p>Max Price: {player.max_bid_limit}</p>
                  <span
                    className="statuss"
                    style={{ backgroundColor: "#218838" }}
                  >
                    Sold Price: ₹{player.player_price}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </>
  );
};

export default TeamWisePlayers;
