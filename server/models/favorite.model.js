// models/favorite.model.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        ref: 'User',  // Ссылка на модель User
        index: true    // Индекс для быстрого поиска по пользователю
    },
    m_id: {
        type: Number,
        required: true,
        ref: 'Attraction',  // Ссылка на модель Attraction
        index: true         // Индекс для быстрого поиска по достопримечательности
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    // Составной уникальный индекс - нельзя добавить одно и то же дважды
    indexes: [
        { unique: true, fields: ['username', 'm_id'] }
    ]
});

const Favorite = mongoose.model('Favorites', favoriteSchema, 'favorites');

module.exports = Favorite;