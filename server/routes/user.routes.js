const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const favoriteController = require('../controllers/favorite.controller')
const authMiddleware = require('../middleware/auth.middleware');
//const avatarUpload = require('../services/avatar-upload.service');


router.get('/', usersController.getAllUsers);
router.get('/:username', usersController.getUserByUsername);
router.get('/:username/favorites', favoriteController.getUserFavs);

router.use(authMiddleware.authenticate);

router.put('/me', usersController.updateMyProfile);

router.post('/me/favorites/:m_id', favoriteController.addToFav);        // Добавить
router.delete('/me/favorites/:m_id', favoriteController.removeFromFav); // Удалить
router.get('/me/favorites/check/:m_id', favoriteController.checkIsFav); // Проверить
//router.post('/:username/avatar', authMiddleware.authenticate, avatarUpload.upload.single('avatar'), usersController.uploadUserAvatar);

module.exports = router;