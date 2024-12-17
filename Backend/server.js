const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const userRoutes = require('./routes/users');
const auctionRoutes = require('./routes/auctions');
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const bidRoutes = require('./routes/bids');
const slabRoutes = require('./routes/slabs');

// Routes Middleware
app.use('/users', userRoutes);
app.use('/auctions', auctionRoutes);
app.use('/teams', teamRoutes);
app.use('/players', playerRoutes);
app.use('/bids', bidRoutes);
app.use('/slabs', slabRoutes);

// Server start
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
