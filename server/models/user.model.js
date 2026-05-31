const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: null
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

// ✅ ПРАВИЛЬНЫЙ pre-save хук - ТОЛЬКО async, БЕЗ next
userSchema.pre('save', async function () {
    // Если пароль не изменялся, пропускаем
    if (!this.isModified('password_hash')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Метод проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;