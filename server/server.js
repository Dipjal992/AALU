require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const pendingOrders = {};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Swad Restro API running!', location: 'Dharan, Putali Line' });
});

// Menu API
app.get('/api/menu', (req, res) => {
    const menu = [
        { id: 1, name: 'Classic Espresso', category: 'coffee', price: 180 },
        { id: 2, name: 'Creamy Cappuccino', category: 'coffee', price: 250 },
        { id: 3, name: 'Caramel Latte', category: 'coffee', price: 320 },
        { id: 4, name: 'Butter Croissant', category: 'pastry', price: 200 },
        { id: 5, name: 'Chocolate Danish', category: 'pastry', price: 230 },
        { id: 6, name: 'Tiramisu', category: 'dessert', price: 350 },
        { id: 7, name: 'New York Cheesecake', category: 'dessert', price: 380 },
        { id: 8, name: 'Masala Chai', category: 'beverage', price: 150 },
        { id: 9, name: 'Fresh Lemonade', category: 'beverage', price: 180 },
        { id: 10, name: 'Mango Lassi', category: 'beverage', price: 250 }
    ];
    res.json(menu);
});

// ESEWA PAYMENT
app.post('/api/esewa/initiate', (req, res) => {
    const { amount } = req.body;
    const pid = 'SWAD-' + Date.now();
    const tax = Math.round(amount * 0.13);
    const sc = Math.round(amount * 0.10);
    const total = amount + tax + sc;

    pendingOrders[pid] = {
        pid, amount, tax, sc, total,
        status: 'pending',
        location: 'R75J+R2Q, Putali Line, Dharan 56700',
        createdAt: new Date().toISOString()
    };

    const url = 'https://uat.esewa.com.np/epay/main?' +
        'amt=' + amount +
        '&pdc=0' +
        '&psc=' + sc +
        '&txAmt=' + tax +
        '&tAmt=' + total +
        '&pid=' + pid +
        '&scd=EP01TEST' +
        '&su=http://localhost:' + PORT + '/api/esewa/success' +
        '&fu=http://localhost:' + PORT + '/api/esewa/failure';

    res.json({ success: true, paymentUrl: url, orderId: pid, totalAmount: total });
});

app.get('/api/esewa/success', (req, res) => {
    const { pid, amt, refId } = req.query;
    if (pendingOrders[pid]) {
        pendingOrders[pid].status = 'paid';
        pendingOrders[pid].refId = refId;
    }
    res.redirect('/payment-success.html?pid=' + pid + '&refId=' + refId + '&amt=' + amt);
});

app.get('/api/esewa/failure', (req, res) => {
    const { pid } = req.query;
    if (pendingOrders[pid]) pendingOrders[pid].status = 'failed';
    res.redirect('/payment-failed.html?pid=' + pid);
});

// Orders API
app.get('/api/orders', (req, res) => {
    const orders = Object.values(pendingOrders);
    res.json({ orders, total: orders.length });
});

app.post('/api/orders', (req, res) => {
    const order = { id: 'ORD-' + Date.now(), ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    res.status(201).json({ success: true, order });
});

// Reservations API
let reservations = [];
app.post('/api/reservations', (req, res) => {
    const reservation = { id: 'RES-' + Date.now(), ...req.body, status: 'confirmed', location: 'R75J+R2Q, Putali Line, Dharan 56700', createdAt: new Date().toISOString() };
    reservations.push(reservation);
    res.status(201).json({ success: true, reservation });
});

app.get('/api/reservations', (req, res) => {
    res.json({ reservations, total: reservations.length });
});

// Serve homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'swad-restro.html'));
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('  🍽️  Swad Restro - Dharan');
    console.log('  📍  Putali Line, Dharan 56700');
    console.log('  🌐  http://localhost:' + PORT);
    console.log('  💳  eSewa Payment: READY');
    console.log('========================================');
});
