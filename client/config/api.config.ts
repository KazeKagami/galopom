// config/api.config.ts
import { Platform } from 'react-native';

// Вариант 1: Для реального устройства с известным IP
const DEV_IP = '192.168.31.126'; // ← ВАШ IP (меняйте когда он меняется)
const DEV_PORT = '5000';

// Вариант 2: Для разных сред
const ENV = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
};

// Автоматическое определение окружения
const getCurrentEnv = (): string => {
    if (__DEV__) {
        return ENV.DEVELOPMENT;
    }
    return ENV.PRODUCTION;
};

// Получение базового URL
const getBaseUrl = (): string => {
    const env = getCurrentEnv();

    switch (env) {
        case ENV.DEVELOPMENT:
            if (Platform.OS === 'android' && !__DEV__) {
                // Реальный Android-девайс
                return `http://${DEV_IP}:${DEV_PORT}`;
            } else if (Platform.OS === 'android') {
                // Android эмулятор (10.0.2.2 = localhost для эмулятора)
                return 'http://10.0.2.2:5000';
            } else if (Platform.OS === 'ios' && !__DEV__) {
                // Реальный iOS-девайс
                return `http://${DEV_IP}:${DEV_PORT}`;
            } else {
                // iOS симулятор
                return 'http://localhost:5000';
            }

        case ENV.PRODUCTION:
            return 'https://your-production-api.com';

        default:
            return 'http://localhost:5000';
    }
};

export const API_CONFIG = {
    baseURL: getBaseUrl(),
    apiURL: `${getBaseUrl()}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Для более простого использования
export const API_URL = `${API_CONFIG.baseURL}/api`;