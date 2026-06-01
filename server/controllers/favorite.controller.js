const favoriteService = require("../services/favorite.service")

const getUserFavs = async (req, res, next) => {
    try {
        const { username } = req.params;
        const favorites = await favoriteService.getUserFavorites(username);

        res.json({
            success: true,
            count: favorites.length,
            favorites
        });
    } catch (error) {
        next(error);
    }
};

const addToFav = async (req, res, next) => {
    try {
        const { username, att_m_id } = req.body;

        if (!username || !att_m_id) {
            return res.status(400).json({
                success: false,
                message: 'username и att_m_id обязательны'
            });
        }

        const data = await favoriteService.addToFavorites(username, att_m_id);

        res.status(201).json({
            success: true,
            message: `Добавлен объект ${data.att_m_id} пользователю ${data.username}`,
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
        const { username, att_m_id } = req.body;

        await favoriteService.removeFromFavorites(username, att_m_id);

        res.json({
            success: true,
            message: `Удален объект ${att_m_id} из избранного пользователя ${username}`
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
        const { username, att_m_id } = req.params;
        const isFavorite = await favoriteService.isFavorite(username, parseInt(att_m_id));

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