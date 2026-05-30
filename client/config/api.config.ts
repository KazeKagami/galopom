// config/api.config.ts (ВЕРСИЯ ДЛЯ ВЕБ-САЙТА)

// Определяем окружение по хосту
const isProduction = window.location.hostname !== 'localhost' 
                  && !window.location.hostname.includes('192.168')
                  && !window.location.hostname.includes('127.0.0.1');

// Базовый URL для API
// В production запросы идут на тот же сервер (относительный путь /api)
// В development - на localhost:5000
const getBaseUrl = (): string => {
    if (isProduction) {
        // На сервере: используем относительный путь
        return '';  // Пустая строка = запросы на тот же домен
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
