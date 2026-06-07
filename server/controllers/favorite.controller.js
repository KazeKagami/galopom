const favoriteService = require("../services/favorite.service")

const getUserFavs = async (req, res, next) => {
    try {
        const { username } = req.params;
        const favorites = await favoriteService.getUserFavorites(username);

        res.json(favorites);
    } catch (error) {
        next(error);
    }
};

const addToFav = async (req, res, next) => {
    try {
        const { username, m_id } = req.body;

        if (!username || !m_id) {
            return res.status(400).json({
                success: false,
                message: 'username и m_id обязательны'
            });
        }

        const data = await favoriteService.addToFavorites(username, m_id);

        res.status(201).json({
            success: true,
            message: `Добавлен объект ${data.m_id} пользователю ${data.username}`,
            data
        });
    } catch (error) {
        if (error.message === 'Already in favorites') {
            return res.status(409).json({
                success: false,
                message: 'Объект уже в избранном'
            });
        }
        next(error);
    }
};

const removeFromFav = async (req, res, next) => {
    try {
        const { username, m_id } = req.body;

        await favoriteService.removeFromFavorites(username, m_id);

        res.json({
            success: true,
            message: `Удален объект ${m_id} из избранного пользователя ${username}`
        });
    } catch (error) {
        if (error.message === 'Not found in favorites') {
            return res.status(404).json({
                success: false,
                message: 'Объект не найден в избранном'
            });
        }
        next(error);
    }
};

const checkIsFav = async (req, res, next) => {
    try {
        const { username, m_id } = req.params;
        const isFavorite = await favoriteService.isFavorite(username, parseInt(m_id));

        res.json({
            success: true,
            isFavorite
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToFav,
    removeFromFav,
    getUserFavs,
    checkIsFav
};