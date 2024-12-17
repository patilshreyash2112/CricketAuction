const express = require('express');
const router = express.Router();
const db = require('../config');

// Get all teams
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM teams';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, teams: results });
    });
});

// Create a new team
router.post('/', (req, res) => {
    const { team_name, user_id, auction_id } = req.body;
    const sql = 'INSERT INTO teams (team_name, user_id, auction_id) VALUES (?, ?, ?)';
    db.query(sql, [team_name, user_id, auction_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Team created', team_id: result.insertId });
    });
});

// Create a new team
router.post('/addteams', async (req, res) => {
    const { team_name, user_id, remaining_units, auction_id } = req.body;

    if (!team_name || !remaining_units) {
        return res.status(400).json({ message: 'Team name, user ID, and auction ID are required.' });
    }

    try {
        const query = 'INSERT INTO teams (team_name, user_id, remaining_units, auction_id) VALUES (?, ?, ?, ?)';
         db.query(query, [team_name, user_id, remaining_units, auction_id]);
        return res.status(201).json({ success: true, message: 'Team added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding team', error });
    }
});


// Update remaining units for bidding
router.put('/:id', (req, res) => {
    const teamId = req.params.id;
    const { remaining_units } = req.body;

    const sql = 'UPDATE teams SET remaining_units = ? WHERE team_id = ?';
    db.query(sql, [remaining_units, teamId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.json({ success: true, message: 'Remaining units updated', teamId, remaining_units });
    });
});



//update 
router.put('/updateteam/:id', async (req, res) => {
    const { team_name, remaining_units  } = req.body; // Add any other necessary fields
    const { id } = req.params;
    // Validate incoming data
    if (!team_name || !remaining_units) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = 'UPDATE teams SET team_name = ?,remaining_units = ?  WHERE team_id = ?';
        const result =  db.query(query, [team_name, remaining_units, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        return res.status(200).json({ success: true, message: 'Team updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating Team', error });
    }
});

//delete
router.delete('/deleteteam/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM teams WHERE team_id = ?';
        const result =  db.query(query, [id]);
        return res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting team', error });
    }
});

// Get player count per slab for a team
router.get('/:teamId/slab-count', (req, res) => {
    const teamId = req.params.teamId;
    const { slab } = req.query;
    const sql = 'SELECT COUNT(*) AS playerCount FROM players WHERE team_id = ? AND slab = ? AND sold = 1';
    db.query(sql, [teamId, slab], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, playerCount: result[0].playerCount });
    });
});

router.get('/:teamId/total-players', (req, res) => {
    const teamId = req.params.teamId;

    const sql = 'SELECT COUNT(*) AS playerCount FROM players WHERE team_id = ?';
    db.query(sql, [teamId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, playerCount: result[0].playerCount });
    });
});

router.get('/max-teams', (req, res) => {

    const sql = 'SELECT COUNT(*) AS teamCount FROM teams';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, totalTeamCount: result[0].teamCount });
    });
});

module.exports = router;
