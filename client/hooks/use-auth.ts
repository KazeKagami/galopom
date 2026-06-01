// hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/auth.api';
import { apiClient } from '@/services/api.client';
import { getAccessToken, getRefreshToken, saveToken, removeToken } from '@/utils/token-storage';
import { AuthState } from '@/types/auth.types';

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: true
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const accessToken = await getAccessToken();

            if (accessToken) {
                apiClient.setAccessToken(accessToken);

                try {
                    const response = await authApi.getMe();
                    setState({
                        user: response.user,
                        accessToken: accessToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    // Токен истек, пробуем обновить
                    if (error.message?.includes('expired') || error.message?.includes('401')) {
                        console.log('Token expired, trying to refresh...');
                        const newAccessToken = await refreshAccessToken();

                        if (newAccessToken) {
                            apiClient.setAccessToken(newAccessToken);
                            const response = await authApi.getMe();
                            setState({
                                user: response.user,
                                accessToken: newAccessToken,
                                isAuthenticated: true,
                                isLoading: false
                            });
                        } else {
                            await logout();
                        }
                    } else {
                        throw error;
                    }
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await logout();
        }
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                console.log('No refresh token available');
                return null;
            }

            const response = await authApi.refreshToken(refreshToken);
            await saveToken(response.accessToken, refreshToken);
            return response.accessToken;
        } catch (error) {
            console.error('Refresh failed:', error);
            return null;
        }
    };

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });

        // Сохраняем оба токена
        await saveToken(response.accessToken, response.refreshToken);
        apiClient.setAccessToken(response.accessToken);

        setState({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false
        });

        return response;
    };

    const register = async (username: string, email: string, password: string) => {
        const response = await authApi.register({ username, email, password });

        // Сохраняем оба токена
        await saveToken(response.accessToken, response.refreshToken);
        apiClient.setAccessToken(response.accessToken);

        setState({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false
        });

        return response;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await removeToken();
            apiClient.setAccessToken(null);
            setState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    };

    return {
        ...state,
        login,
        register,
        logout,
        checkAuth
    };
};