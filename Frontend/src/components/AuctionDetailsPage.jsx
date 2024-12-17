import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addPlayer,
  addTeam,
  addSlab,
  fetchPlayers,
  fetchSlabs,
  updatePlayer,
  updateTeam,
  updateSlab,
  deletePlayer,
  deleteTeam,
  deleteSlab,
  fetchTeamsNew,
} from "../services/api";
import Navbar from "./Navbar";
import "../styles/AuctionDetailsPage.css";
import "bootstrap/dist/css/bootstrap.css";

const AuctionDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auctionId, userId } = location.state;

  const [activeForm, setActiveForm] = useState("player");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [slab, setSlab] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [remainingUnits, setRemainingUnits] = useState("");
  const [slabId, setSlabId] = useState("");
  const [slabName, setSlabName] = useState("");
  const [maxBidLimit, setMaxBidLimit] = useState("");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [slabs, setSlabs] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingSlab, setEditingSlab] = useState(null);

  const loadData = async () => {
    const playerData = await fetchPlayers(auctionId);
    const teamData = await fetchTeamsNew(auctionId);
    const slabData = await fetchSlabs();
    setPlayers(playerData);
    setTeams(teamData);
    setSlabs(slabData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPlayer = async () => {
    console.log("add");
    if (!playerName || !slab) {
      setError("Player name, slab, and base price are required");
      return;
    }

    const response = await addPlayer({
      player_name: playerName,
      slab: slab,
      base_price: Number(basePrice),
    });
    if (response.success) {
      setSuccessMessage("Player added successfully!");
      resetPlayerForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const handleUpdatePlayer = async () => {
    console.log(playerId);
    const response = await updatePlayer(
      {
        player_name: playerName,
        slab: slab,
      },
      playerId
    );
    if (response.success) {
      setSuccessMessage("Player updated successfully!");
      resetPlayerForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const resetPlayerForm = () => {
    setEditingPlayer(null);
    setPlayerName("");
    setSlab("");
    setBasePrice("");
  };

  const handleDeletePlayer = async (id) => {
    const response = await deletePlayer(id);
    setPlayers(players.filter((player) => player.player_id !== id));
    if (response.success) {
      setSuccessMessage("Player deleted successfully!");
      loadData();
    } else {
      setError(response.message);
    }
  };

  const handleAddTeam = async () => {
    if (!teamName || !remainingUnits) {
      setError("Team name is required");
      return;
    }

    const response = await addTeam({
      team_name: teamName,
      // user_id: userId,
      remaining_units: Number(remainingUnits),
      // auction_id: auctionId,
    });
    if (response.success) {
      setSuccessMessage("Team added successfully!");
      resetTeamForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const handleUpdateTeam = async () => {
    const response = await updateTeam(
      {
        team_name: teamName,
        remaining_units: Number(remainingUnits),
      },
      teamId
    );
    if (response.success) {
      setSuccessMessage("Team updated successfully!");
      resetTeamForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const resetTeamForm = () => {
    setEditingTeam(null);
    setTeamName("");
    setRemainingUnits("");
  };

  const handleDeleteTeam = async (id) => {
    const response = await deleteTeam(id);
    setTeams(teams.filter((team) => team.team_id !== id));
    if (response.success) {
      setSuccessMessage("Team deleted successfully!");
      loadData();
    } else {
      setError(response.message);
    }
  };

  const handleAddSlab = async () => {
    if (!slabName || !basePrice || !maxBidLimit) {
      setError("All fields are required for slab");
      return;
    }

    const response = await addSlab({
      slab_name: slabName,
      base_price: Number(basePrice),
      max_bid_limit: Number(maxBidLimit),
    });
    if (response.success) {
      setSuccessMessage("Slab added successfully!");
      resetSlabForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const handleUpdateSlab = async () => {
    const response = await updateSlab(
      {
        slab_name: slabName,
        base_price: Number(basePrice),
        max_bid_limit: Number(maxBidLimit),
      },
      slabId
    );

    if (response.success) {
      setSuccessMessage("Slab updated successfully!");
      resetSlabForm();
      loadData();
    } else {
      setError(response.message);
    }
  };

  const resetSlabForm = () => {
    setEditingSlab(null);
    setSlabName("");
    setBasePrice("");
    setMaxBidLimit("");
  };

  const handleDeleteSlab = async (id) => {
    const response = await deleteSlab(id);
    if (response.success) {
      setSuccessMessage("Slab deleted successfully!");
      loadData();
    } else {
      setError(response.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auction-details-container">
        {/* <h1 className="auction-title">AUCTION DETAILS</h1> */}
        <center>
          <h1
            style={{
              fontSize: "36px",
              color: "black",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            AUCTION DETAILS
          </h1>
        </center>

        <div className="button-group">
          <button
            className={activeForm === "player" ? "active" : ""}
            onClick={() => setActiveForm("player")}
          >
            Player
          </button>
          <button
            className={activeForm === "team" ? "active" : ""}
            onClick={() => setActiveForm("team")}
          >
            Team
          </button>
          <button
            className={activeForm === "slab" ? "active" : ""}
            onClick={() => setActiveForm("slab")}
          >
            Slab
          </button>
          <button className="navigate-button" onClick={() => navigate("/home")}>
            Dashboard
          </button>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          successMessage && <div className="success">{successMessage}</div>
        )}

        {activeForm === "player" && (
          <>
            <h3>Existing Players</h3>
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Player Name</th>
                  <th>Slab</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.player_id}>
                    <td>{index + 1}</td>
                    <td>{player.player_name}</td>
                    <td>{player.slab}</td>
                    <td style={{ display: "flex" }}>
                      <button
                        style={{ marginRight: "10px" }}
                        className="edit-button"
                        onClick={() => {
                          setEditingPlayer("Update Player");
                          setPlayerName(player.player_name);
                          setSlab(player.slab);
                          setPlayerId(player.player_id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePlayer(player.player_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>{editingPlayer ? "Update Player" : "Add Player"}</h3>
            <input
              type="text"
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Slab"
              value={slab}
              onChange={(e) => setSlab(e.target.value)}
            />
            <button
              onClick={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
            >
              {editingPlayer ? "Update Player" : "Add Player"}
            </button>
          </>
        )}

        {activeForm === "team" && (
          <>
            <h3>Existing Teams</h3>
            <table className="table table-striped table-light">
              <thead className="thead-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Team Name</th>
                  <th>Remaining Units</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.team_id}>
                    <td>{index + 1}</td> {/* Sr No column */}
                    <td>{team.team_name}</td>
                    <td>{team.remaining_units}</td>
                    <td style={{ display: "flex" }}>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditingTeam("Update Team");
                          setTeamName(team.team_name);
                          setRemainingUnits(team.remaining_units);
                          setTeamId(team.team_id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteTeam(team.team_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>{editingTeam ? "Update Team" : "Add Team"}</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Remaining Units"
              value={remainingUnits}
              onChange={(e) => setRemainingUnits(e.target.value)}
            />
            <button onClick={editingTeam ? handleUpdateTeam : handleAddTeam}>
              {editingTeam ? "Update Team" : "Add Team"}
            </button>
          </>
        )}

        {activeForm === "slab" && (
          <>
            <h3>Existing Slabs</h3>
            <table className="table table-striped table-light">
              <thead className="thead-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Slab Name</th>
                  <th>Base Price</th>
                  <th>Max Bid Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab, index) => (
                  <tr key={slab.slab_id}>
                    <td>{index + 1}</td> {/* Sr No column */}
                    <td>{slab.slab_name}</td>
                    <td>{slab.base_price}</td>
                    <td>{slab.max_bid_limit}</td>
                    <td style={{ display: "flex" }}>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditingSlab("Update Slab");
                          setSlabId(slab.slab_id);
                          setSlabName(slab.slab_name);
                          setBasePrice(slab.base_price);
                          setMaxBidLimit(slab.max_bid_limit);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteSlab(slab.slab_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>{editingSlab ? "Update Slab" : "Add Slab"}</h3>
            <input
              type="text"
              placeholder="Slab Name"
              value={slabName}
              onChange={(e) => setSlabName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Base Price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Bid Limit"
              value={maxBidLimit}
              onChange={(e) => setMaxBidLimit(e.target.value)}
            />
            <button onClick={editingSlab ? handleUpdateSlab : handleAddSlab}>
              {editingSlab ? "Update Slab" : "Add Slab"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default AuctionDetailsPage;
