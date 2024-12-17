import React, { useEffect, useState } from "react";
import { fetchSoldPlayers } from "../services/api"; // Adjust the path to your API file

const SoldPlayers = () => {
  const [players, setPlayers] = useState([]);

  // Fetch all players
  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchSoldPlayers();
      setPlayers(data || []); // Set players state
    };
    loadPlayers();
  }, []);

  // Filter for sold players
  const soldPlayers = players.filter((player) => player.sold);

  return (
    <>
      <h1>Sold Players</h1>
      <div className="players-grid">
        {soldPlayers.map((player) => (
          <div key={player.player_id} className={`player-card sold`}>
            <div className="card-content">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuBrvN6FrsGZM6CzHM_Vc0eyxM9EijAjXeTQ&s"
                alt="Player"
              />
              <h3>{player.player_name || "No Name"}</h3>
              <p>Team: {player.team_name || "N/A"}</p>
              <p>Slab: {player.slab_name || "N/A"}</p>
              <p>Base Price: {player.base_price || "N/A"}</p>
              <p>Sold Price: {player.player_price || "N/A"}</p>
              <span className="status">Sold</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SoldPlayers;
