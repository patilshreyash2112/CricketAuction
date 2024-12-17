const express = require('express');
const router = express.Router();
const db = require('../config');

// Create a new auction
router.post('/', (req, res) => {
    const { auction_name, user_id } = req.body;
    const sql = 'INSERT INTO auctions (auction_name, user_id) VALUES (?, ?)';
    db.query(sql, [auction_name, user_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Auction created', auction_id: result.insertId });
    });
});

// Get all auctions
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM auctions where user_id=?';
    db.query(sql,[id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, auctions: results });
    });
});

// Delete an auction
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM auctions WHERE auction_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Auction deleted' });
    });
});

module.exports = router;
