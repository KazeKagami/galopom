// utils/token-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Функция для сохранения обоих токенов
export const saveTokens = async (accessToken: string, refreshToken: string) => {
    try {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        console.log('✅ Both tokens saved');
    } catch (error) {
        console.error('Error saving tokens:', error);
    }
};

// Функция для сохранения только access token (для обратной совместимости)
export const saveToken = async (accessToken: string) => {
    try {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        console.log('✅ Access token saved');
    } catch (error) {
        console.error('Error saving access token:', error);
    }
};

// Функция для сохранения refresh token отдельно
export const saveRefreshToken = async (refreshToken: string) => {
    try {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        console.log('✅ Refresh token saved');
    } catch (error) {
        console.error('Error saving refresh token:', error);
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const removeTokens = async () => {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        console.log('✅ Both tokens removed');
    } catch (error) {
        console.error('Error removing tokens:', error);
    }
};

// Для обратной совместимости
export const getToken = getAccessToken;
export const removeToken = removeTokens;