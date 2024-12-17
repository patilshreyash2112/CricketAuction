import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPlayers,
  fetchTeams,
  fetchTeamPlayerCountPerSlab,
  updatePlayerBid,
  updateTeamBid,
  fetchTotalPlayersPerTeam,
  fetchMaxPlayerLimit,
  fetchMaxTeamLimit,
} from "../services/api";
import "../styles/BiddingPage.css";
import ToastNotification from "../components/ToastNotification";
import Navbar from "./Navbar";

// Utility function to randomly select a winner from tied teams
const randomClassMethod = (teams) => {
  const randomIndex = Math.floor(Math.random() * teams.length);
  return teams[randomIndex]; // Return the randomly selected team ID
};

const BiddingPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [teamBids, setTeamBids] = useState({});
  const [lastBid, setLastBid] = useState(null); // Track the last bid for validation
  const navigate = useNavigate();
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    const loadPlayer = async () => {
      const data = await fetchPlayers();
      const selectedPlayer = data.find(
        (p) => p.player_id === parseInt(playerId)
      );
      setPlayer(selectedPlayer);
      if (selectedPlayer) {
        setCurrentBid(selectedPlayer.base_price); // Set initial bid to base price
        await loadTeams(selectedPlayer.slab);
      }
    };

    const loadTeams = async (slab) => {
      const response = await fetchTeams();
      const maxPlayerLimit = await fetchMaxPlayerLimit(); // Fetch the max player limit
      setTotalPlayers(maxPlayerLimit);
      const maxTeamLimit = await fetchMaxTeamLimit();
      setTotalTeams(maxTeamLimit);
      if (response.success && maxPlayerLimit !== null) {
        const teamData = await Promise.all(
          response.teams.map(async (team) => {
            const totalPlayersResponse = await fetchTotalPlayersPerTeam(
              team.team_id
            );
            const slabCountResponse = await fetchTeamPlayerCountPerSlab(
              team.team_id,
              slab
            );

            return {
              ...team,
              totalPlayerCount: totalPlayersResponse.success
                ? totalPlayersResponse.playerCount
                : 0,
              playerCountPerSlab: slabCountResponse.success
                ? { [slab]: slabCountResponse.playerCount }
                : {},
              maxPlayerLimit: maxPlayerLimit, // Store max player limit in each team
              maxTeamLimit: maxTeamLimit,
            };
          })
        );
        setTeams(teamData);
      } else {
        console.error("Failed to fetch teams or max player limit");
      }
    };

    loadPlayer(); // Call to load player which will also load teams
  }, [playerId]);

  const handleBidChange = (teamId, value) => {
    // Update the bid amount for the specific team
    setTeamBids((prev) => ({ ...prev, [teamId]: value }));
  };

  const handlePlaceBid = (teamId) => {
    const bidAmount = teamBids[teamId] || 0; // Default to 0 if undefined
    const selectedTeam = teams.find((team) => team.team_id === teamId);
    const maxBidLimit = player.max_bid_limit; // Max bid limit for the player
    const teamSlabCount = selectedTeam.playerCountPerSlab[player.slab] || 0; // Get current count for this slab

    // Check if the team has reached the total player limit (e.g., 8 players)
    if (
      selectedTeam.totalPlayerCount >= Math.floor(totalPlayers / totalTeams)
    ) {
      alert(
        `${
          selectedTeam.team_name
        } has reached the maximum player limit of ${Math.floor(
          totalPlayers / totalTeams
        )}.`
      );
      return; // Exit if the team already has 8 players
    }

    // Validate slab limit
    if (teamSlabCount >= 2) {
      alert(
        `${selectedTeam.team_name} has already purchased 2 players from slab ${player.slab_name}.`
      );
      return;
    }

    // Allowing the first bid to be equal to the base price
    if (bidAmount <= 0) {
      alert("Please enter a bid amount.");
      return;
    }

    // If the current bid is the base price, allow the bid to match it
    if (currentBid === player.base_price) {
      if (bidAmount < currentBid) {
        alert("Bid amount must be at least the base price for the first bid.");
        return;
      } else {
        // Check if the team has enough remaining units
        if (selectedTeam.remaining_units < bidAmount) {
          alert(
            `Insufficient remaining units. You have ₹${selectedTeam.remaining_units} left.`
          );
          return;
        }
        // Update lastBid and currentBid if the bid is equal to the base price
        setCurrentBid(bidAmount);
        setLastBid({ teamId, bidAmount });
        return; // Exit function after successfully placing the bid
      }
    }

    // Check if the bid is higher than the current bid and not equal to max limit
    if (bidAmount <= currentBid && bidAmount !== maxBidLimit) {
      alert("Bid amount must be higher than the current bid.");
      return;
    }

    // Additional validation for the bid amount
    if (bidAmount > maxBidLimit) {
      alert(
        `Bid amount cannot exceed the maximum bid limit of ₹${maxBidLimit}`
      );
      return;
    }

    // Check if the team has enough remaining units for the bid
    if (selectedTeam.remaining_units < bidAmount) {
      alert(
        `Insufficient remaining units. You have ₹${selectedTeam.remaining_units} left.`
      );
      return;
    }

    // Update the last bid and current bid if bid amount is higher
    if (bidAmount === maxBidLimit || bidAmount > currentBid) {
      setCurrentBid(bidAmount);
      setLastBid({ teamId, bidAmount });
    }
  };

  // Handle Final Sold button
  const handleFinalSold = async () => {
    if (!lastBid) {
      alert("No valid bids placed");
      return;
    }

    const highestBidTeams = Object.entries(teamBids)
      .filter(([_, bid]) => bid === lastBid.bidAmount) // Get teams with the highest bid
      .map(([teamId]) => teamId);

    const finalBid = lastBid.bidAmount;

    let winningTeamId;
    if (highestBidTeams.length === 1) {
      winningTeamId = highestBidTeams[0]; // Only one winner
    } else {
      // Randomly select a winner among the tying teams at max bid limit
      winningTeamId = randomClassMethod(highestBidTeams);
    }

    // Prepare the updated player object
    const updatedPlayer = {
      ...player,
      player_price: finalBid,
      sold: true,
      team_id: winningTeamId, // Assign player to the winning team
    };

    // Update remaining units for the winning team
    const winningTeam = teams.find(
      (team) => team.team_id === parseInt(winningTeamId)
    );
    const updatedTeam = {
      ...winningTeam,
      remaining_units: winningTeam.remaining_units - finalBid, // Deduct bid amount from remaining units
    };

    // Update the slab-wise player count for the winning team
    const updatedPlayerCountPerSlab = {
      ...winningTeam.playerCountPerSlab,
      [player.slab_name]:
        (winningTeam.playerCountPerSlab[player.slab_name] || 0) + 1,
    };

    updatedTeam.playerCountPerSlab = updatedPlayerCountPerSlab;

    try {
      await updatePlayerBid(updatedPlayer); // Send PUT request to update player
      await updateTeamBid(updatedTeam); // Send PUT request to update team remaining units and player count per slab
      console.log(
        "Player and team updated successfully:",
        updatedPlayer,
        updatedTeam
      );
    } catch (error) {
      console.error("Error updating player or team:", error);
      return;
    }

    ToastNotification(
      `${player.player_name} sold to ${winningTeam.team_name} for ₹${finalBid}`
    );

    // Redirect to HomePage with the 'teamwiseplayers' tab selected
    navigate(`/home`, { state: { activeTab: "teamwiseplayers" } });
  };

  if (!player) {
    return <div>No player selected for bidding.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bidding-page-container">
        <center>
          <h1
            style={{
              fontSize: "33px",
              borderRadius: "15px",
              backgroundColor: "rgb(0, 0, 0)",
              color: "white",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            BIDDING DETAILS
          </h1>
        </center>
        <center>
          <h3>
            {player.player_name} - Current Bid:{" "}
            <span style={{ color: "green" }}> ₹{currentBid}</span>
            {lastBid && (
              <>
                {" "}
                by{" "}
                {
                  teams.find((team) => team.team_id === lastBid.teamId)
                    ?.team_name
                }
              </>
            )}
          </h3>
        </center>

        <center>
          <div className="player-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuBrvN6FrsGZM6CzHM_Vc0eyxM9EijAjXeTQ&s"
              alt="Player"
            />
            <h2 style={{fontSize:'1.5em'}}>{player.player_name}</h2>
            <p>Slab: {player.slab_name}</p>
            <p>Base Price: ₹{player.base_price}</p>
            <p>Max Price: ₹{player.max_bid_limit}</p>
          </div>
        </center>

        <div className="teams-container">
          {teams.map((team) => (
            <div className="team-card" key={team.team_id}>
              <h2 style={{ height: "60px", marginTop: "10px",fontSize: "1.5rem" }}>
                {team.team_name}
              </h2>
              <p>
                Remaining Units: <b>₹{team.remaining_units}</b>
              </p>
              <p>
                Total Players:{" "}
                <b>
                  {team.totalPlayerCount} /{" "}
                  {Math.floor(totalPlayers / totalTeams)}
                </b>
              </p>{" "}
              {/* Show total number of players */}
              <p>
                Slab {player.slab_name}:{" "}
                <b>{team.playerCountPerSlab[player.slab] || 0} / 2 players</b>
              </p>
              <div className="bid-section">
                {/* <label>Enter Bid Amount:</label> */}
                <input
                  type="number"
                  placeholder="Enter bid amount"
                  value={teamBids[team.team_id] || ""}
                  onChange={(e) =>
                    handleBidChange(team.team_id, Number(e.target.value))
                  }
                />
                <button
                  className="bid-button"
                  onClick={() => handlePlaceBid(team.team_id)}
                >
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>

        <center>
          <button
            style={{ color: "white", backgroundColor: "red",marginTop: "2rem" }}
            className="sold-button"
            onClick={handleFinalSold}
          >
            Final Sold
          </button>
        </center>
      </div>
    </>
  );
};

export default BiddingPage;
