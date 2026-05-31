// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/auth.api';
import { apiClient } from '@/services/api.client';
import { getToken, removeToken, saveToken } from '@/utils/token-storage';
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
            const token = await getToken();
            if (token) {
                apiClient.setAccessToken(token);
                const response = await authApi.getMe(token);
                setState({
                    user: response.user,
                    accessToken: token,
                    isAuthenticated: true,
                    isLoading: false
                });
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