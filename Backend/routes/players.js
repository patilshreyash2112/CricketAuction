const express = require('express');
const router = express.Router();
const db = require('../config');

// Create a new player
router.post('/', (req, res) => {
    const { player_name, slab, auction_id,user_id } = req.body;
    const sql = 'INSERT INTO players (player_name, slab, auction_id, user_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [player_name, slab, auction_id, user_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Player created', player_id: result.insertId });
    });
});
// Create a new player
router.post('/addplayers', async (req, res) => {
    const { player_name, slab,  auction_id, user_id } = req.body;
    if (!player_name || !slab ) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const sql = 'INSERT INTO players (player_name, slab, auction_id, user_id) VALUES (?, ?, ?, ?)';
         db.query(sql, [player_name, slab, auction_id, user_id]);
        return res.status(201).json({ success: true, message: 'Player added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding player', error });
    }
});



// Fetch all players with slab details
router.get('/all', (req, res) => {
    const sql = `
        SELECT players.player_id, players.player_name, players.slab, players.sold, 
        players.team_id, players.auction_id, players.player_price, slabs.slab_id, slabs.slab_name, 
        slabs.base_price, slabs.max_bid_limit 
        FROM players 
        JOIN slabs ON players.slab = slabs.slab_id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, players: results });
    });
});

// Fetch sold players
router.get('/sold', (req, res) => {
    const sql = `
        SELECT players.player_id, players.player_name, players.slab, players.sold, 
        players.team_id, players.auction_id, players.player_price, teams.team_name, teams.user_id, 
        teams.remaining_units, teams.auction_id, slabs.slab_id, slabs.slab_name, slabs.max_bid_limit, 
        slabs.base_price 
        FROM players 
        JOIN teams ON players.team_id = teams.team_id 
        JOIN slabs ON players.slab = slabs.slab_id 
        WHERE players.sold = 1
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, players: results });
    });
});

// Fetch unsold players
router.get('/unsold', (req, res) => {
    const sql = `
        SELECT players.player_id, players.player_name, players.slab, players.sold, 
        players.team_id, players.auction_id, players.player_price, teams.team_name, teams.user_id, 
        teams.remaining_units, teams.auction_id, slabs.slab_id, slabs.slab_name, slabs.max_bid_limit, 
        slabs.base_price 
        FROM players 
        JOIN teams ON players.team_id = teams.team_id 
        JOIN slabs ON players.slab = slabs.slab_id 
        WHERE players.sold = 0
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, players: results });
    });
});

router.put('/:id', async (req, res) => {
    const playerId = req.params.id;
    const { player_price, sold, team_id} = req.body;
    try {
        const result = db.query(
            'UPDATE players SET player_price = ?, sold = ?,team_id = ? WHERE player_id = ?',
            [player_price, sold, team_id, playerId]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Player not found or not updated' });
        }
        res.json({ success: true, message: 'Player updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//update 
router.put('/updateplayer/:id', async (req, res) => {
    const { player_name, slab  } = req.body; // Add any other necessary fields
    const { id } = req.params;
    // Validate incoming data
    if (!player_name || !slab) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = 'UPDATE players SET player_name = ?,slab = ?  WHERE player_id = ?';
        const result =  db.query(query, [player_name, slab, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Player not found' });
        }

        return res.status(200).json({ success: true, message: 'Player updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating player', error });
    }
});

//delete
router.delete('/deleteplayer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM players WHERE player_id = ?';
        const result =  db.query(query, [id]);

        // if (result.affectedRows === 0) {
        //     return res.status(404).json({ success: false, message: 'Player not found' });
        // }

        return res.status(200).json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting player', error });
    }
});

router.get('/max-players', (req, res) => {

    const sql = 'SELECT COUNT(*) AS playerCount FROM players';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, totalPlayerCount: result[0].playerCount });
    });
});
module.exports = router;
