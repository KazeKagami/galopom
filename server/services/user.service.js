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

module.exports = {
    getAllUsers,
    getUserByUsername,
    UserNotFoundError,
    ValidationError
};