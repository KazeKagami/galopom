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

const updateMyProfile = async (req, res, next) => {
    try {
        console.log('=== UPDATE PROFILE DEBUG ===');
        console.log('Headers:', req.headers);
        console.log('User from token:', req.user);
        console.log('Request body:', req.body);

        const username = req.user.username;
        const updateData = req.body;

        console.log('Username from token:', username);
        console.log('Update data:', updateData);

        const updatedUser = await userService.updateUserProfile(
            username,
            updateData,
            req.user
        );

        console.log('Updated user result:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('ERROR in updateMyProfile:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);

        // Отправляем подробную ошибку клиенту
        res.status(500).json({
            error: error.message,
            details: error.stack
        });
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
    updateMyProfile,
    //uploadUserAvatar
};