const express = require('express');
const router = express.Router();
const db = require('../config');

// Create a new bid
router.post('/', (req, res) => {
    const { team_id, player_id, auction_id, bid_amount } = req.body;
    const sql = 'INSERT INTO bids (team_id, player_id, auction_id, bid_amount) VALUES (?, ?, ?, ?)';
    db.query(sql, [team_id, player_id, auction_id, bid_amount], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Bid placed', bid_id: result.insertId });
    });
});

// Get all bids
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM bids';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, bids: results });
    });
});

module.exports = router;
