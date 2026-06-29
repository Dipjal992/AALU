const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    occasion: {
        type: String,
        enum: ['Casual Dining', 'Birthday', 'Anniversary', 'Business Meeting', 'Other'],
        default: 'Casual Dining'
    },
    specialRequests: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    tableAssigned: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);