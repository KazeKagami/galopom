// hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/auth.api';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '@/utils/token-storage';
import { router } from 'expo-router';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await getAccessToken();

            if (token) {
                const response = await authApi.getMe(token);
                setUser(response.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await tryRefreshToken();
        } finally {
            setIsLoading(false);
        }
    };

    const tryRefreshToken = async () => {
        try {
            const refreshToken = await getRefreshToken();

            if (!refreshToken) {
                console.log('No refresh token available');
                await logout();
                return false;
            }

            console.log('Attempting to refresh token...');
            const response = await authApi.refreshToken(refreshToken);

            if (response.accessToken) {
                // Сохраняем новый access token, refresh token оставляем тот же
                await saveTokens(response.accessToken, refreshToken);

                // Повторно получаем данные пользователя
                const userResponse = await authApi.getMe(response.accessToken);
                setUser(userResponse.user);
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Refresh failed:', error);
            await logout();
            return false;
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authApi.login({ email, password });

            if (response.accessToken && response.refreshToken) {
                await saveTokens(response.accessToken, response.refreshToken);
                setUser(response.user);
                setIsAuthenticated(true);
                return response;
            } else {
                throw new Error('No tokens received');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authApi.register({ username, email, password });

            if (response.accessToken && response.refreshToken) {
                await saveTokens(response.accessToken, response.refreshToken);
                setUser(response.user);
                setIsAuthenticated(true);
                return response;
            } else {
                throw new Error('No tokens received');
            }
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await removeTokens();
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/auth/login');
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth
    };
};