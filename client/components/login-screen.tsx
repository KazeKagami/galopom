// screens/LoginScreen.tsx
import { authApi } from '@/features/auth/auth.api';
import { apiClient } from '@/services/api.client';
import { saveToken } from '@/utils/token-storage';
import { router } from 'expo-router';
import { useState } from 'react';

const handleLogin = async (email: string, password: string) => {
    const [error, setError] = useState<string | null>(null);

    try {
        // ✅ Теперь response - это сразу AuthResponse
        const response = await authApi.login({ email, password });

        // response.user, response.accessToken - доступны напрямую
        console.log('User:', response.user.username);
        console.log('Token:', response.accessToken);

        // Сохраняем токен
        await saveToken(response.accessToken);
        apiClient.setAccessToken(response.accessToken);

        // Перенаправляем
        router.replace('/(tabs)');
    } catch (error: any) {
        console.error('Login failed:', error.message);
        setError(error.message);
    }
};