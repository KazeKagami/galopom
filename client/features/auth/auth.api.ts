// features/auth/auth.api.ts
import { apiClient } from '@/services/api.client';
import { API_URL } from '@/config/api.config';

export const authApi = {
    login: async (data: { email: string; password: string }) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        return result; // Должен содержать accessToken и refreshToken
    },

    register: async (data: { username: string; email: string; password: string }) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        return result;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Refresh failed');
        }

        return result;
    },

    getMe: async (accessToken: string) => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get user');
        }

        return result;
    },

    logout: async () => {
        // Опционально: отправить запрос на сервер для инвалидации токена
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};