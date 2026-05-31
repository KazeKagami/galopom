require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');  // ← импорт подключения

// Подключаем маршруты
const attractionRoutes = require('./routes/attraction.routes');
const sortRoutes = require('./routes/filter.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Подключение к MongoDB
connectDB();

// Базовый маршрут для проверки
app.get('/api', (req, res) => {
    res.json({ message: 'API Галопом по Европам работает!' });
});

// Маршруты
app.use('/api/attractions', attractionRoutes);
app.use('/api/filter', sortRoutes);
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes)

app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

// Запуск сервера
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});