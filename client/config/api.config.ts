// config/api.config.ts

// Безопасная проверка окружения
const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isReactNative = !isWeb && typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Определение продакшен окружения
const isProduction = ((): boolean => {
    // Для web используем hostname
    if (isWeb) {
        return window.location.hostname !== 'localhost'
            && !window.location.hostname.includes('192.168')
            && !window.location.hostname.includes('127.0.0.1');
    }

    // Для React Native используем переменные окружения
    // В Expo: __DEV__ глобальная переменная
    return !(__DEV__); // __DEV__ = true в разработке, false в production
})();

// Получение базового URL для API
const getBaseUrl = (): string => {
    // WEB версия
    if (isWeb) {
        if (isProduction) {
            // Продакшен: тот же домен
            return '';
        } else {
            // Локальная разработка
            return 'http://localhost:5000';
        }
    }

    // REACT NATIVE версия
    if (isReactNative) {
        if (isProduction) {
            // Продакшен: реальный IP вашего сервера
            // Например: 'https://api.yoursite.com'
            return 'https://your-production-server.com';
        } else {
            // Разработка: IP компьютера в локальной сети
            // Android эмулятор: 10.0.2.2 вместо localhost
            // Физическое устройство: IP вашего компьютера
            return 'http://192.168.1.100:5000'; // 👈 Замените на ваш IP
        }
    }

    // Fallback
    return 'http://localhost:5000';
};

export const API_CONFIG = {
    baseURL: getBaseUrl(),
    apiURL: `${getBaseUrl()}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

export const API_URL = `${API_CONFIG.baseURL}/api`;