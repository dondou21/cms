const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new service order
router.post('/', async (req, res) => {
    const { event_id, title, date, description, location, theme, sequences, announcements } = req.body;
    try {
        const query = `
            INSERT INTO service_orders 
            (event_id, title, date, description, location, theme, sequences, announcements) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;
        const values = [
            event_id || null, 
            title, 
            date, 
            description, 
            location, 
            theme, 
            JSON.stringify(sequences), 
            JSON.stringify(announcements)
        ];
        
        const [result] = await db.execute(query, values);
        res.status(201).json(result[0]);
    } catch (err) {
        console.error('Error creating service order:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all service orders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM service_orders ORDER BY created_at DESC');
        res.json(rows.map(row => ({
            ...row,
            sequences: typeof row.sequences === 'string' ? JSON.parse(row.sequences) : row.sequences,
            announcements: typeof row.announcements === 'string' ? JSON.parse(row.announcements) : row.announcements
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific service order
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM service_orders WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        
        const row = rows[0];
        res.json({
            ...row,
            sequences: typeof row.sequences === 'string' ? JSON.parse(row.sequences) : row.sequences,
            announcements: typeof row.announcements === 'string' ? JSON.parse(row.announcements) : row.announcements
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
