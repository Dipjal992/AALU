const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['coffee', 'pastry', 'dessert', 'beverage']
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
    },
    badge: {
        type: String,
        enum: ['bestseller', 'new', 'veg', null],
        default: null
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        default: 15 // minutes
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

menuItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);