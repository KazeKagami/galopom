// services/auth.api.ts
import { apiClient } from '@/services/api.client';
import { RegisterData, LoginData, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
    // ✅ Теперь все методы возвращают сразу data (без .data)
    register: (data: RegisterData) =>
        apiClient.post<AuthResponse>('/auth/register', data),

    login: (data: LoginData) =>
        apiClient.post<AuthResponse>('/auth/login', data),

    logout: () =>
        apiClient.post<{ success: boolean; message: string }>('/auth/logout'),

    refresh: () =>
        apiClient.post<{ success: boolean; accessToken: string }>('/auth/refresh'),

    getMe: (accessToken?: string) => {
        if (accessToken) {
            apiClient.setAccessToken(accessToken);
        }
        return apiClient.get<{ success: boolean; user: User }>('/auth/me');
    }
};