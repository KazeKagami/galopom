// services/api.client.ts
import { API_URL } from '../config/api.config';
import { getAccessToken, saveToken, removeToken, getRefreshToken, saveRefreshToken } from '@/utils/token-storage';

class ApiClient {
    private baseURL: string;
    private accessToken: string | null = null;
    private isRefreshing = false;
    private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

    constructor() {
        this.baseURL = API_URL;
    }

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    private async refreshToken(): Promise<string | null> {
        console.log('🔄 Trying to refresh token...');
        try {
            const refreshToken = await getRefreshToken();

            if (!refreshToken) {
                console.log('No refresh token available');
                return null;
            }

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.accessToken;
                // Исправлено: сохраняем только accessToken
                await saveToken(data.accessToken);
                await saveRefreshToken(refreshToken);
                console.log('✅ Token refreshed successfully');
                return data.accessToken;
            }

            console.log('❌ Refresh failed, need re-login');
            await removeToken();
            return null;
        } catch (error) {
            console.error('Refresh error:', error);
            return null;
        }
    }

    private async processQueue(error: Error | null, token: string | null = null) {
        this.failedQueue.forEach(promise => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    private async fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
        // Получаем токен из storage или из памяти
        let token = this.accessToken;
        if (!token) {
            token = await getAccessToken();
            if (token) {
                this.accessToken = token;
            }
        }

        const makeRequest = async (requestToken: string | null) => {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (requestToken) {
                headers['Authorization'] = `Bearer ${requestToken}`;
            }

            // Копируем существующие заголовки
            if (options.headers) {
                const existingHeaders = options.headers as Record<string, string>;
                Object.keys(existingHeaders).forEach(key => {
                    headers[key] = existingHeaders[key];
                });
            }

            return fetch(url, {
                ...options,
                headers
            });
        };

        let response = await makeRequest(token);

        // Если получили 401 и у нас есть токен, пробуем обновить
        if (response.status === 401 && token) {
            console.log('⚠️ Got 401, attempting to refresh token...');

            if (this.isRefreshing) {
                // Если уже идет обновление, добавляем в очередь
                return new Promise((resolve, reject) => {
                    this.failedQueue.push({ resolve, reject });
                }).then(async (newToken) => {
                    return makeRequest(newToken as string);
                });
            }

            this.isRefreshing = true;
            const newToken = await this.refreshToken();
            this.isRefreshing = false;

            if (newToken) {
                this.accessToken = newToken;
                this.processQueue(null, newToken);
                return makeRequest(newToken);
            } else {
                this.processQueue(new Error('Refresh failed'), null);
                throw new Error('Session expired. Please login again.');
            }
        }

        return response;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await this.fetchWithAuth(`${this.baseURL}${endpoint}`, {
            method: 'GET',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        return data;
    }

    async post<T>(endpoint: string, body?: any): Promise<T> {
        const response = await this.fetchWithAuth(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        return data;
    }

    async put<T>(endpoint: string, body?: any): Promise<T> {
        const response = await this.fetchWithAuth(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        return data;
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await this.fetchWithAuth(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        return data;
    }
}

export const apiClient = new ApiClient();