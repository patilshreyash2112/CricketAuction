import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AuctionsList from './components/AuctionsList';

import HomePage from './components/HomePage';
import UnsoldPlayers from './components/UnsoldPlayers';
import BiddingPage from './components/BiddingPage';
import SoldPlayers from './components/SoldPlayers';
import SlabWisePlayers from './components/SlabWisePlayers';
import TeamWisePlayers from './components/TeamWisePlayers';
import AuctionSetupPage from './components/AuctionDetailsPage';
import AuctionDetailsPage from './components/AuctionDetailsPage';


const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path='/users/login' element={<Login />} />
                <Route path='/users/register' element={<Register />} />
                <Route path='/auctions' element={<AuctionsList />} />
                <Route path='/auction/:id' element={<AuctionDetailsPage />} />
                <Route path="/setup-auction" element={<AuctionSetupPage />} />
                <Route path="/bid/:auctionId" element={<HomePage />} />
                <Route path="/unsold-players" element={<UnsoldPlayers />} />
                <Route path="/soldplayers" element={<SoldPlayers />} />
                <Route path="/bidding/:playerId" element={<BiddingPage />} />
                <Route path="/slabwiseplayers" element={<SlabWisePlayers />} />
                <Route path="/teamwiseplayers" element={<TeamWisePlayers />} />
                {/* Add more routes as needed */}
            </Routes>
            
        </div>
    );
};

export default App;
