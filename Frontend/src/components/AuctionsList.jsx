import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuctions, createAuction, deleteAuction } from "../services/api"; // Ensure your API functions are correctly implemented
import Navbar from "./Navbar"; // Assuming there's a Navbar component for navigation
import "../styles/AuctionsList.css"; // Assuming you have CSS for styling

const AuctionsList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAuctionName, setNewAuctionName] = useState("");
  const navigate = useNavigate();

  // Fetch auctions when the component loads
  useEffect(() => {
    const fetchAuctions = async () => {
      const i = localStorage.getItem("user_id");
      console.log(i);
      try {
        const response = await getAuctions(i);
        console.log(response);
        setAuctions(response.auctions || []); // Safeguard in case response.data is undefined
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch auctions");
        setLoading(false);
      }
    };

    fetchAuctions();
  });

  // Handle deleting an auction
  const handleDeleteAuction = async (id) => {
    const response = await deleteAuction(id);
    if (response.success) {
      // fetchAuctions(); // Refresh the auction list after deletion
      setError(""); // Clear any error messages
      // Refresh auctions list after deletion
      const updatedAuctions = await getAuctions();
      setAuctions(updatedAuctions.auctions || []);
    } else {
      setError(response.message);
    }
  };

  // Handle creating a new auction
  const handleCreateAuction = async () => {
    if (!newAuctionName.trim()) {
      setError("Auction name is required");
      return;
    }

    // Retrieve the logged-in user's ID from localStorage
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User is not logged in");
      return;
    }

    try {
      const response = await createAuction({
        auction_name: newAuctionName.trim(),
        user_id: userId, // Use the dynamically retrieved user ID
      });

      if (response.success) {
        // Refetch auctions after a new auction is created
        const updatedAuctions = await getAuctions();
        setAuctions(updatedAuctions.auctions || []); // Update auctions based on correct response
        setNewAuctionName(""); // Clear input field
        setError(""); // Clear previous errors
      } else {
        setError("Failed to create auction");
      }
    } catch (error) {
      setError("Error creating auction");
    }
  };

  // Handle clicking on an auction to navigate to its details page
  const handleAuctionClick = (auctionId, userId) => {
    navigate(`/auction/${auctionId}`, {
      state: { auctionId, userId }, // Passing auctionId and userId to the next page
    });
  };

  return (
    <>
      <Navbar />
      <div className="auction-list-container">
        <h2 style={{marginBottom:'1rem'}}>Auctions List</h2>

        {/* Display loading state */}
        {loading && <div>Loading auctions...</div>}

        {/* Display error if any */}
        {error && <div className="error">{error}</div>}

        {/* Auction Creation Form */}
        <div className="create-auction-form">
          <input
            type="text"
            placeholder="Enter new auction name"
            value={newAuctionName}
            onChange={(e) => setNewAuctionName(e.target.value)}
          />
          <button onClick={handleCreateAuction}>Create Auction</button>
        </div>

        {/* Display the list of auctions */}
        {!loading && auctions.length > 0 ? (
          <ul className="auction-list">
            {auctions.map((auction) => (
              <li key={auction.auction_id}>
                {auction.auction_name}
                <div className="button-groupp" >
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAuctionClick(auction.auction_id)}
                  >
                    Start
                  </button>{" "}
                  {/* Bid button */}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAuction(auction.auction_id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <div>No auctions available</div>
        )}
      </div>
    </>
  );
};

export default AuctionsList;
