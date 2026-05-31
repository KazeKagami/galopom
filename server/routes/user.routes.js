const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
//const authMiddleware = require('../middleware/auth.middleware');
//const avatarUpload = require('../services/avatar-upload.service');


router.get('/', usersController.getAllUsers);
router.get('/:username', usersController.getUserByUsername);
//router.post('/:username/avatar', authMiddleware.authenticate, avatarUpload.upload.single('avatar'), usersController.uploadUserAvatar);

module.exports = router;