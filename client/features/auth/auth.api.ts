// services/auth.api.ts
import { API_URL } from '@/config/api.config';
import { apiClient } from '@/services/api.client';
import { RegisterData, LoginData, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
    // ✅ Теперь все методы возвращают сразу data (без .data)
    register: (data: RegisterData) =>
        apiClient.post<AuthResponse>('/auth/register', data),

    login: (data: LoginData) =>
        apiClient.post<AuthResponse>('/auth/login', data),

    logout: async () => {
        try {
            // Используем обычный fetch без проверки авторизации
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.warn('Logout response not OK:', response.status);
            }

            // Не важно, что вернул сервер, просто возвращаем успех
            return { success: true, message: 'Logged out' };
        } catch (error) {
            console.warn('Logout request failed:', error);
            // Всё равно возвращаем успех для клиентской части
            return { success: true, message: 'Logged out locally' };
        }
    },

    refresh: () =>
        apiClient.post<{ success: boolean; accessToken: string }>('/auth/refresh'),

    getMe: (accessToken?: string) => {
        if (accessToken) {
            apiClient.setAccessToken(accessToken);
        }
        return apiClient.get<{ success: boolean; user: User }>('/auth/me');
    }
};