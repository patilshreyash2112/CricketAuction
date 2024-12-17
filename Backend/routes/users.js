const express = require('express');
const router = express.Router();
const db = require('../config');

// Register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        return res.json({ success: true, message: 'Registration successful', user_id: result.insertId });
    });
});

// Login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const sql = 'SELECT user_id, username FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        res.json({ success: true, message: 'Login successful', user: results[0] });
    });
});

// Get a user by user_id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT user_id, username FROM users WHERE user_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: results[0] });
    });
});

// Get all users (optional)
router.get('/', (req, res) => {
    const sql = 'SELECT user_id, username FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, users: results });
    });
});

module.exports = router;
