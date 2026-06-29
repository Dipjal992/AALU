const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Create reservation
router.post('/', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all reservations (admin)
router.get('/', async (req, res) => {
    try {
        const { date, status } = req.query;
        const query = {};
        if (date) query.date = new Date(date);
        if (status) query.status = status;
        
        const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update reservation status
router.patch('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;