// models/token.model.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // 7 дней
    }
});

tokenSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Token', tokenSchema);