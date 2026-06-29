const express = require('express');
const router = express.Router();

// In-memory loyalty store (replace with database in production)
const loyaltyMembers = {};

// Get loyalty points
router.get('/:phone', (req, res) => {
    const member = loyaltyMembers[req.params.phone];
    if (member) {
        res.json(member);
    } else {
        res.json({ points: 0, name: 'Guest', tier: 'bronze' });
    }
});

// Add loyalty points
router.post('/add', (req, res) => {
    const { phone, points, name } = req.body;
    
    if (!loyaltyMembers[phone]) {
        loyaltyMembers[phone] = { points: 0, name: name || 'Guest' };
    }
    
    loyaltyMembers[phone].points += points;
    if (name) loyaltyMembers[phone].name = name;
    
    // Determine tier
    const totalPoints = loyaltyMembers[phone].points;
    let tier = 'bronze';
    if (totalPoints >= 1500) tier = 'gold';
    else if (totalPoints >= 500) tier = 'silver';
    
    loyaltyMembers[phone].tier = tier;
    
    res.json(loyaltyMembers[phone]);
});

// Redeem points
router.post('/redeem', (req, res) => {
    const { phone, points } = req.body;
    
    if (!loyaltyMembers[phone]) {
        return res.status(404).json({ error: 'Member not found' });
    }
    
    if (loyaltyMembers[phone].points < points) {
        return res.status(400).json({ error: 'Insufficient points' });
    }
    
    loyaltyMembers[phone].points -= points;
    res.json(loyaltyMembers[phone]);
});

module.exports = router;