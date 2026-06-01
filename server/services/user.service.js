// services/users.service.js
const Users = require("../models/user.model");

// Кастомные ошибки
class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotFoundError';
        this.statusCode = 404;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

const getAllUsers = async () => {
    try {
        const query = Users.find({ username: { $ne: 'Kiiro' } }).select('-_id -password_hash');
        return await query;
    } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
};

const getUserByUsername = async (username) => {
    if (!username || username.trim() === '') {
        throw new ValidationError('Username is required');
    }

    try {
        const user = await Users.findOne({ username }).select('-password_hash'); // Не возвращаем пароль!

        if (!user) {
            throw new UserNotFoundError(`User with username "${username}" not found`);
        }

        // Добавляем avatar_url для удобства на клиенте
        const userResponse = user.toObject();
        if (user.avatar) {
            userResponse.avatar_url = user.avatar;
        } else {
            userResponse.avatar_url = null;
        }

        return userResponse;
    } catch (error) {
        if (error instanceof UserNotFoundError || error instanceof ValidationError) {
            throw error;
        }
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
};

const updateUserProfile = async (username, updateData, currentUser) => {
    console.log('=== SERVICE DEBUG ===');
    console.log('Username param:', username);
    console.log('UpdateData:', updateData);
    console.log('CurrentUser:', currentUser);

    // 1. Проверяем права
    if (username !== currentUser.username && currentUser.role !== 'admin') {
        console.log('Permission denied');
        throw new ValidationError('You can only update your own profile');
    }

    const { username: newUsername, email, avatar } = updateData;
    console.log('Parsed data - newUsername:', newUsername, 'email:', email, 'avatar:', avatar);

    // 2. Проверяем username
    if (newUsername && newUsername !== username) {
        console.log('Checking if username exists:', newUsername);
        const existingUser = await Users.findOne({ username: newUsername });
        if (existingUser) {
            throw new ValidationError('Username already taken');
        }
    }

    // 3. Проверяем email
    if (email) {
        console.log('Checking if email exists:', email);
        const existingUser = await Users.findOne({
            email: email.toLowerCase(),
            username: { $ne: username }
        });
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }
    }

    // 4. Готовим обновление
    const updateFields = {};
    if (newUsername) updateFields.username = newUsername;
    if (email) updateFields.email = email.toLowerCase();
    if (avatar !== undefined) updateFields.avatar = avatar;

    console.log('Update fields to apply:', updateFields);

    // 5. Обновляем
    const updatedUser = await Users.findOneAndUpdate(
        { username },
        updateFields,
        { new: true, runValidators: true }
    ).select('-password_hash');

    if (!updatedUser) {
        throw new UserNotFoundError(`User with username "${username}" not found`);
    }

    console.log('User updated successfully:', updatedUser);
    return updatedUser;
};

module.exports = {
    getAllUsers,
    getUserByUsername,
    updateUserProfile,
    UserNotFoundError,
    ValidationError
};