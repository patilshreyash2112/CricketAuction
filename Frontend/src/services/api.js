import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Your server URL

// Login user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Login failed' };
    }
};

// Register user
export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, user);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Registration failed' };
    }
};

// // Fetch Auctions
// export const fetchAuctions = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/auctions`);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// };

// // Create Auction
// export const createAuction = async (auctionData) => {
//     try {
//         const response = await axios.post(`${API_URL}/auctions`, auctionData);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: 'Failed to create auction' };
//     }
// };

// // Delete Auction
export const deleteAuction = async (auctionId) => {
    try {
        const response = await axios.delete(`${API_URL}/auctions/${auctionId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete auction' };
    }
};



// Get the list of auctions
export const getAuctions = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/auctions/${id}`);
        // console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching auctions:', error);
        throw error;
    }
};

// Create a new auction
export const createAuction = async (auctionData) => {
    try {
        const response = await axios.post(`${API_URL}/auctions`, auctionData);
        return response.data;
    } catch (error) {
        console.error('Error creating auction:', error);
        return { success: false, message: 'Failed to create auction' };
    }
};


// Fetch all players
export const fetchPlayers = async () => {
    try {
        const response = await axios.get(`${API_URL}/players/all`);
        return response.data.players;
    } catch (error) {
        console.error('Error fetching all players:', error);
        return [];
    }
};

// Fetch sold players
export const fetchSoldPlayers = async () => {
    try {
        const response = await axios.get(`${API_URL}/players/sold`);
        return response.data.players;
    } catch (error) {
        console.error('Error fetching sold players:', error);
        return [];
    }
};

// Fetch unsold players
export const fetchUnsoldPlayers = async () => {
    try {
        const response = await axios.get(`${API_URL}/players/unsold`);
        return response.data.players;
    } catch (error) {
        console.error('Error fetching unsold players:', error);
        return [];
    }
};



// Fetch All Teams



// Fetch player count per slab for a team
// export const fetchTeamPlayerCountPerSlab = async (teamId, slabName) => {
//     try {
//         console.log('api '+slabName)
//         console.log('api '+teamId)
//         const response = await axios.get(`${API_URL}/teams/${teamId}/slab-count?slab=${slabName}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching player count for slab:', error);
//         throw error;
//     }
// };

export const updateTeamBid = async (team) => {
    const response = await fetch(`${API_URL}/teams/${team.team_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
    });
    return response.json();
};


//Update Player
export const updatePlayerBid = async (player) => {
    try {
        const response = await axios.put(`${API_URL}/players/${player.player_id}`, player); // Assuming REST API convention
        return response.data;
    } catch (error) {
        console.error('Failed to update player', error);
        throw error;
    }
};



// Function to fetch player count per slab for a specific team
export const fetchTeamPlayerCountPerSlab = async (teamId, slab) => {
    try {
        const response = await axios.get(`${API_URL}/teams/${teamId}/slab-count?slab=${slab}`);
        return response.data; // Expecting { success: true, playerCount: <number> }
    } catch (error) {
        console.error(`Error fetching player count for team ${teamId} in slab ${slab}:`, error);
        return { success: false, playerCount: 0 }; // Return a default value in case of error
    }
};



// Add a player to the auction
export const addPlayer = async (playerData) => {
    try {
        const response = await axios.post(`${API_URL}/players/addplayers`, playerData);
        return response.data;
    } catch (error) {
        console.error('Error adding player:', error);
        return { success: false, message: 'Failed to add player' };
    }
};

export const updatePlayer = async (player,id) => {
    try{
        console.log(id)
    const response = await axios.put(`${API_URL}/players/updateplayer/${id}`, player);
    return response.data;
    }
    catch (error) {
        throw new Error('Error updating player: ' + error.response.data.message);
    }
};

export const deletePlayer = async (id) => {
    try{
        
        const res=await axios.delete(`${API_URL}/players/deleteplayer/${id}`);
        
        return res.data;
    }
    catch (error) {
    throw new Error('Error deleting player: ' + error.response.data.message);
    }
}

// Add a team to the auction
export const addTeam = async (teamData) => {
    try {
        const response = await axios.post(`${API_URL}/teams/addteams`, teamData);
        return response.data;
    } catch (error) {
        console.error('Error adding team:', error);
        return { success: false, message: 'Failed to add team' };
    }
};

export const fetchTeams = async () => {
    try {
        const response = await axios.get(`${API_URL}/teams`);
        return response.data; // Return the teams data
    } catch (error) {
        throw new Error('Error fetching teams: ' + error.message);
    }
}; 
export const fetchTeamsNew = async () => {
    try {
        const response = await axios.get(`${API_URL}/teams`);
        return response.data.teams; // Return the teams data
    } catch (error) {
        throw new Error('Error fetching teams: ' + error.message);
    }
}; 

export const fetchTeamsbid = async () => {
    try {
        const response = await axios.get(`${API_URL}/teams`);
        return response.data; // Return the teams data
    } catch (error) {
        throw new Error('Error fetching teams: ' + error.message);
    }
}; 

export const updateTeam = async (teamData, id) => {
    try {
        const response = await axios.put(`${API_URL}/teams/updateteam/${id}`, teamData);
        return response.data; // Return success message
    } catch (error) {
        throw new Error('Error updating team: ' + error.response.data.message);
    }
};

export const deleteTeam = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/teams/deleteteam/${id}`);
        return response.data; // Return success message
    } catch (error) {
        throw new Error('Error deleting team: ' + error.response.data.message);
    }
};

// Add a slab to the auction
export const addSlab = async (slabData) => {
    try {
        const response = await axios.post(`${API_URL}/slabs/addslabs`, slabData);
        return response.data;
    } catch (error) {
        console.error('Error adding slab:', error);
        return { success: false, message: 'Failed to add slab' };
    }
};

export const fetchSlabs = async () => {
    try {
        const response = await axios.get(`${API_URL}/slabs`);
        return response.data.slabs; // Return the slabs data
    } catch (error) {
        throw new Error('Error fetching slabs: ' + error.message);
    }
};

export const updateSlab = async (slabData,id) => {
    try {
        const response = await axios.put(`${API_URL}/slabs/updateslab/${id}`, slabData);
        return response.data; // Return success message
    } catch (error) {
        throw new Error('Error updating slab: ' + error.response.data.message);
    }
};

export const deleteSlab = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/slabs/deleteslab/${id}`);
        return response.data; // Return success message
    } catch (error) {
        throw new Error('Error deleting slab: ' + error.response.data.message);
    }
};

export const fetchTotalPlayersPerTeam = async (team_id) => {
    try {
        const response = await fetch(`${API_URL}/teams/${team_id}/total-players`);
        const data = await response.json();
       
        if (data.success) {
            return { success: true, playerCount: data.playerCount };
        } else {
            console.error('Failed to fetch total players for team:', team_id);
            return { success: false, playerCount: 0 };
        }
    } catch (error) {
        console.error('Error fetching total players for team:', error);
        return { success: false, playerCount: 0 };
    }
};

// In services/api.js or wherever your API calls are defined

export const fetchMaxPlayerLimit = async () => {
    try {
        const response = await fetch(`${API_URL}/players/max-players`); // Assuming this is the endpoint
        const data = await response.json();
        if (data.success) {
            return data.totalPlayerCount;
        } else {
            throw new Error('Failed to fetch maximum player limit');
        }
    } catch (error) {
        console.error('Error fetching maximum player limit:', error);
        return null;
    }
};

export const fetchMaxTeamLimit = async () => {
    try {
        const response = await fetch(`${API_URL}/teams/max-teams`); // Assuming this is the endpoint
        const data = await response.json();
        if (data.success) {
            return data.totalTeamCount;
        } else {
            throw new Error('Failed to fetch maximum Team limit');
        }
    } catch (error) {
        console.error('Error fetching maximum team limit:', error);
        return null;
    }
};
