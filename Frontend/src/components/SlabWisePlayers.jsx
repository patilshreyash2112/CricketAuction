import React, { useEffect, useState } from "react";
import { fetchSoldPlayers } from "../services/api";
import "../styles/SlabWisePlayers.css";

const SlabWisePlayers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchSoldPlayers(); // Fetch all players
      setPlayers(data.filter((p) => p.sold)); // Only show sold players
    };

    loadPlayers();
  }, []);

  const slabs = [...new Set(players.map((slab) => slab.slab))];

  return (
    <>
      <h1>Players by Slab</h1>
      <div className="slabwise-players-container">
        {slabs.map((slab) => (
          <div key={slab}>
            <h2 className={`slab-heading slab`}>Slab {players.find(player => player.slab === slab)?.slab_name || "Unknown Slab"}</h2>
            <div className="player-grid">
              {players
                .filter((player) => player.slab === slab)
                .map((player) => (
                  <div
                    key={player.player_id}
                    className={`player-card slab-${slab}`}
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
                      style={{ backgroundColor: "#218838" }}
                      className="statuss"
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

export default SlabWisePlayers;
