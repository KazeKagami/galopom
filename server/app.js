const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');  // ← импорт подключения

// Подключаем маршруты
const attractionRoutes = require('./routes/attractions');
//const authRoutes = require('./routes/auth')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
connectDB();

// Маршруты
app.use('/api/attractions', attractionRoutes);
//app.use("/api/auth", authRoutes)

// Базовый маршрут для проверки
app.get('/api', (req, res) => {
    res.json({ message: 'API Галопом по Европам работает!' });
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