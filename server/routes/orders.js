const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
    try {
        const { status, orderType, paymentStatus } = req.query;
        const query = {};
        if (status) query.orderStatus = status;
        if (orderType) query.orderType = orderType;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (admin)
router.patch('/:orderId/status', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { orderStatus: req.body.status, updatedAt: Date.now() },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;