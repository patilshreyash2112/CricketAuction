import React, { useEffect, useState } from "react";
import {
  fetchPlayers,
  fetchTeams,
  fetchTeamPlayerCountPerSlab,
  updatePlayerBid,
  updateTeamBid,
} from "../services/api"; // Adjust the path to your API file
import ToastNotification from "../components/ToastNotification"; // Assuming you have a ToastNotification component

const UnsoldPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch all players
  const loadPlayers = async () => {
    const data = await fetchPlayers();
    setPlayers(data || []); // Assuming your API returns an array of players
  };

  // Fetch all teams
  const loadTeams = async () => {
    const response = await fetchTeams();
    if (response.success) {
      setTeams(response.teams);
    } else {
      console.error("Failed to fetch teams");
    }
  };

  useEffect(() => {
    loadPlayers();
    loadTeams();
  }, []);

  // Function to handle player click and auto-assign to remaining team
  const handlePlayerClick = async (player) => {
    // Check how many players each team has in the same slab as the clicked player
    const teamData = await Promise.all(
      teams.map(async (team) => {
        const slabCountResponse = await fetchTeamPlayerCountPerSlab(
          team.team_id,
          player.slab
        );
        return {
          ...team,
          playerCountPerSlab: slabCountResponse.success
            ? slabCountResponse.playerCount
            : 0,
        };
      })
    );

    // Filter out teams that already have two players in this slab
    const teamsWithTwoPlayers = teamData.filter(
      (team) => team.playerCountPerSlab >= 2
    );

    // If two teams already have two players in this slab, auto-assign the player to the remaining team
    if (teamsWithTwoPlayers.length === 2) {
      const remainingTeam = teamData.find(
        (team) => team.playerCountPerSlab < 2
      );

      if (remainingTeam) {
        // Auto-assign player to remaining team
        const updatedPlayer = {
          ...player,
          player_price: player.base_price, // Assign at base price
          sold: true,
          team_id: remainingTeam.team_id, // Assign to the remaining team
        };

        const updatedTeam = {
          ...remainingTeam,
          remaining_units: remainingTeam.remaining_units - player.base_price,
        };

        try {
          await updatePlayerBid(updatedPlayer); // Update player details
          await updateTeamBid(updatedTeam); // Update team details
          ToastNotification(
            `${player.player_name} auto-assigned to ${remainingTeam.team_name} for ₹${player.base_price}`
          );
        } catch (error) {
          console.error("Error updating player or team:", error);
        }
      }
    } else {
      // Fallback to redirecting to the bidding page if auto-assignment conditions are not met
      window.location.href = `/bidding/${player.player_id}`;
    }
  };

  return (
    <>
      <h1>Unsold Players</h1>
      <div className="players-grid">
        {players
          .filter((player) => !player.sold)
          .map(
            (
              player // Filter for unsold players
            ) => (
              <div
                key={player.player_id}
                className="player-link"
                onClick={() => handlePlayerClick(player)}
              >
                <div className={`player-card unsold`}>
                  <div className="card-content">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuBrvN6FrsGZM6CzHM_Vc0eyxM9EijAjXeTQ&s"
                      alt={player.player_name}
                    />
                    <h3>{player.player_name}</h3>
                    <p>Slab: {player.slab_name}</p>
                    <p>Base Price: ₹{player.base_price}</p>
                    <p>Max Price: {player.max_bid_limit || "N/A"}</p>
                    <span className="status">Unsold</span>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </>
  );
};

export default UnsoldPlayers;
