const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    total: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    serviceCharge: {
        type: Number,
        default: 0
    },
    orderType: {
        type: String,
        enum: ['pickup', 'delivery', 'dine-in'],
        default: 'pickup'
    },
    address: {
        type: String
    },
    customerName: {
        type: String
    },
    customerPhone: {
        type: String
    },
    customerEmail: {
        type: String
    },
    paymentMethod: {
        type: String,
        default: 'esewa'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentRef: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    loyaltyPointsEarned: {
        type: Number,
        default: 0
    },
    tableNumber: {
        type: Number
    },
    specialInstructions: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);