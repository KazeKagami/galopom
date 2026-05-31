// services/auth.service.js
const User = require("../models/user.model"); // ✅ Переименовали Users в User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');

class AuthError extends Error {
    constructor(message, statusCode = 401) {
        super(message);
        this.name = 'AuthError';
        this.statusCode = statusCode;
    }
}

// Генерация токенов
const generateTokens = (userId, username, role) => {
    // ✅ Проверяем наличие секретов
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets are not configured in .env file');
    }

    const accessToken = jwt.sign(
        { userId, username, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

// Регистрация
const register = async (userData) => {
    const { username, email, password } = userData;

    // Валидация
    if (!username || !email || !password) {
        throw new AuthError('Username, email and password are required', 400);
    }

    if (password.length < 6) {
        throw new AuthError('Password must be at least 6 characters', 400);
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        if (existingUser.username === username) {
            throw new AuthError('Username already exists', 409);
        }
        if (existingUser.email === email) {
            throw new AuthError('Email already exists', 409);
        }
    }

    // Создание пользователя
    const user = new User({
        username,
        email,
        password_hash: password // Хешируется в pre-save
    });

    await user.save();

    // Генерация токенов
    const tokens = generateTokens(user._id, user.username, user.role);

    // Сохраняем refresh token
    const tokenDoc = new Token({
        userId: user._id,
        token: tokens.refreshToken
    });
    await tokenDoc.save();

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        },
        ...tokens
    };
};

// Логин
const login = async (email, password) => {
    if (!email || !password) {
        throw new AuthError('Email and password are required', 400);
    }

    const user = await User.findOne({
        $or: [{ email }, { username: email }]
    });

    if (!user) {
        throw new AuthError('Invalid credentials', 401);
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new AuthError('Invalid credentials', 401);
    }

    const tokens = generateTokens(user._id, user.username, user.role);

    const tokenDoc = new Token({
        userId: user._id,
        token: tokens.refreshToken
    });
    await tokenDoc.save();

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        ...tokens
    };
};

// Остальные функции (refreshTokens, logout, getCurrentUser) остаются теми же
// Но замените Users на User внутри них

const refreshTokens = async (refreshToken) => {
    if (!refreshToken) {
        throw new AuthError('Refresh token required', 401);
    }

    const tokenDoc = await Token.findOne({ token: refreshToken });
    if (!tokenDoc) {
        throw new AuthError('Invalid refresh token', 401);
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new AuthError('User not found', 401);
        }

        await Token.deleteOne({ _id: tokenDoc._id });

        const tokens = generateTokens(user._id, user.username, user.role);

        const newTokenDoc = new Token({
            userId: user._id,
            token: tokens.refreshToken
        });
        await newTokenDoc.save();

        return tokens;
    } catch (error) {
        await Token.deleteOne({ _id: tokenDoc._id });
        throw new AuthError('Invalid refresh token', 401);
    }
};

const logout = async (refreshToken) => {
    if (refreshToken) {
        await Token.deleteOne({ token: refreshToken });
    }
    return { message: 'Logged out successfully' };
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
        throw new AuthError('User not found', 404);
    }
    return user;
};

module.exports = {
    register,
    login,
    refreshTokens,
    logout,
    getCurrentUser,
    AuthError
};