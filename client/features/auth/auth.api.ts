// features/auth/auth.api.ts
import { API_URL } from '@/config/api.config';
import { apiClient } from '@/services/api.client';
import { LoginData, RegisterData, AuthResponse } from '@/types/auth.types';

export const authApi = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        // response теперь содержит refreshToken
        return response;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    getMe: async (token?: string): Promise<{ user: any }> => {
        if (token) {
            // Временная установка токена для запроса
            const originalToken = apiClient['accessToken'];
            apiClient.setAccessToken(token);
            try {
                return await apiClient.get('/auth/me');
            } finally {
                apiClient.setAccessToken(originalToken);
            }
        }
        return await apiClient.get('/auth/me');
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }) // 👈 Отправляем refreshToken в теле
        });

        if (!response.ok) {
            throw new Error('Refresh failed');
        }

        return response.json();
    }
};