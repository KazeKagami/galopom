// services/favorite.service.js
const Favorite = require('../models/favorite.model');

// Добавить в избранное
const addToFavorites = async (username, m_id) => {
    // Проверяем, не добавлено ли уже
    const existing = await Favorite.findOne({ username, m_id });
    if (existing) {
        throw new Error('Already in favorites');
    }

    const favorite = new Favorite({ username, m_id });
    return await favorite.save();
};

// Удалить из избранного
const removeFromFavorites = async (username, m_id) => {
    const result = await Favorite.deleteOne({ username, m_id });
    if (result.deletedCount === 0) {
        throw new Error('Not found in favorites');
    }
    return result;
};

// Получить все избранные достопримечательности пользователя
const getUserFavorites = async (username) => {
    const favorites = await Favorite.find({ username });
    return favorites;
};

// Проверить, в избранном ли
const isFavorite = async (username, m_id) => {
    const favorite = await Favorite.findOne({ username, m_id });
    return !!favorite;
};

// Получить количество избранных у достопримечательности
const getAttractionFavoritesCount = async (m_id) => {
    return await Favorite.countDocuments({ m_id });
};

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    isFavorite,
    getAttractionFavoritesCount
};