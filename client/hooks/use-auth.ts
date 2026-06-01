// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/auth.api';
import { apiClient } from '@/services/api.client';
import { getToken, removeToken, saveToken } from '@/utils/token-storage';
import { AuthState } from '@/types/auth.types';
import { API_URL } from '@/config/api.config';

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

    const refreshAccessToken = async (): Promise<string | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                await saveToken(data.accessToken);
                apiClient.setAccessToken(data.accessToken);
                return data.accessToken;
            }
            return null;
        } catch {
            return null;
        }
    };

    const checkAuth = async () => {
        try {
            let token = await getToken();
            if (token) {
                apiClient.setAccessToken(token);
                try {
                    const response = await authApi.getMe(token);
                    setState({
                        user: response.user,
                        accessToken: token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    // Если токен истек (401), пробуем обновить
                    if (error.message?.includes('expired') || error.message?.includes('401')) {
                        console.log('Token expired, refreshing...');
                        const newToken = await refreshAccessToken();
                        if (newToken) {
                            const response = await authApi.getMe(newToken);
                            setState({
                                user: response.user,
                                accessToken: newToken,
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

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        await saveToken(response.accessToken);
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
        await saveToken(response.accessToken);
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
        await authApi.logout();
        await removeToken();
        apiClient.setAccessToken(null);
        setState({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false
        });
    };

    return {
        ...state,
        login,
        register,
        logout,
        checkAuth
    };
};