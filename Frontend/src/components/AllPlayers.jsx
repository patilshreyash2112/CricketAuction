import React, { useEffect, useState } from "react";
import { fetchPlayers } from "../services/api"; // Assuming your API fetch is here
import "../styles/Players.css"; // Add your CSS file

const AllPlayers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchPlayers();
      setPlayers(data || []);
    };

    loadPlayers();
  }, []);

  return (
    <>
      <h1>All Players</h1>
      <div className="players-container">
        {players.map((player) => (
          <div
            key={player.player_id}
            className={`player-card ${player.sold ? "sold" : "unsold"}`}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuBrvN6FrsGZM6CzHM_Vc0eyxM9EijAjXeTQ&s"
              alt="Player"
            />
            <h3>{player.player_name}</h3>
            <p>Slab: {player.slab_name}</p>
            <p>Base Price: {player.base_price}</p>
            <p>Max Price: {player.max_bid_limit}</p>
            <p>Status: {player.sold ? "Sold" : "Unsold"}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllPlayers;
