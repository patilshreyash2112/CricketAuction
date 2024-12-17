const express = require('express');
const router = express.Router();
const db = require('../config');

router.post('/addslabs', async (req, res) => {
    const { slab_name, base_price, max_bid_limit } = req.body;

    if (!slab_name || !base_price || !max_bid_limit) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = 'INSERT INTO slabs (slab_name, base_price, max_bid_limit) VALUES (?, ?, ?)';
         db.query(query, [slab_name, base_price, max_bid_limit]);
        return res.status(201).json({ success: true, message: 'Slab added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding slab', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM slabs'; // Adjust the query if needed
        db.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error fetching slabs', error });
            }
            return res.status(200).json({ success: true, slabs: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching slabs', error });
    }
});


router.put('/updateslab/:id', async (req, res) => {
    const { slab_name, base_price, max_bid_limit } = req.body;
    const { id } = req.params;

    if (!slab_name || !base_price || !max_bid_limit) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = 'UPDATE slabs SET slab_name = ?, base_price = ?, max_bid_limit = ? WHERE slab_id = ?';
        const result =  db.query(query, [slab_name, base_price, max_bid_limit, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Slab not found' });
        }

        return res.status(200).json({ success: true, message: 'Slab updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating slab', error });
    }
});


router.delete('/deleteslab/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM slabs WHERE slab_id = ?';
        const result =  db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Slab not found' });
        }

        return res.status(200).json({ success: true, message: 'Slab deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting slab', error });
    }
});

module.exports = router;
