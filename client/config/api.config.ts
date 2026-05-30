// config/api.config.ts

// Безопасная проверка окружения
const isBrowser = typeof window !== 'undefined';

// Определяем окружение по хосту (только в браузере)
const isProduction = isBrowser
    ? window.location.hostname !== 'localhost'
    && !window.location.hostname.includes('192.168')
    && !window.location.hostname.includes('127.0.0.1')
    : process.env.NODE_ENV === 'production'; // Fallback для сервера

// Базовый URL для API
const getBaseUrl = (): string => {
    if (isProduction) {
        // На сервере: используем относительный путь
        return '';
    } else {
        // Локальная разработка
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

export const API_URL = `${API_CONFIG.baseURL}/api`;