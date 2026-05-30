const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Автоматический выбор подключения на основе NODE_ENV
        const env = process.env.NODE_ENV || 'development';

        let mongoURI;
        if (env === 'production') {
            mongoURI = process.env.MONGODB_URI_PROD;
            console.log('🔧 Подключение к ПРОД базе данных');
        } else {
            mongoURI = process.env.MONGODB_URI_DEV;
            console.log('💻 Подключение к ДЕВ базе данных');
        }

        if (!mongoURI) {
            throw new Error(`Отсутствует MONGODB_URI для окружения ${env}`);
        }

        await mongoose.connect(mongoURI, {
            // Дополнительные опции для разных окружений
            serverSelectionTimeoutMS: env === 'production' ? 5000 : 10000,
            socketTimeoutMS: env === 'production' ? 45000 : 60000,
        });

        console.log(`✅ MongoDB успешно подключена (${env})`);
    } catch (error) {
        console.error('❌ Ошибка при подключении:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;