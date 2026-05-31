// controllers/users.controller.js
const userService = require('../services/user.service');
const User = require('../models/user.model'); // 👈 Добавьте эту строку!
const { uploadAvatar } = require('../services/avatar-upload.service');

const getAllUsers = async (req, res, next) => {
    try {
        const data = await userService.getAllUsers();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getUserByUsername = async (req, res, next) => {
    try {
        const data = await userService.getUserByUsername(req.params.username);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

/*const uploadUserAvatar = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Загружаем в Cloudinary
        const result = await uploadAvatar(req.file, username);

        // Сохраняем URL в БД
        const user = await User.findOneAndUpdate(
            { username },
            { avatar: result.secure_url },
            { new: true }
        ).select('-password_hash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            avatarUrl: result.secure_url,
            user
        });
    } catch (error) {
        next(error);
    }
};*/

module.exports = {
    getAllUsers,
    getUserByUsername,
    //uploadUserAvatar
};