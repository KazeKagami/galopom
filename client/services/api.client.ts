// services/api.client.ts

import { API_CONFIG, API_URL } from '../config/api.config';

interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
}

class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_URL;
        this.timeout = API_CONFIG.timeout;
    }

    private buildUrl(endpoint: string, params?: Record<string, any>) {
        if (!params) return `${this.baseURL}${endpoint}`;

        const query = new URLSearchParams(params as any).toString();
        return `${this.baseURL}${endpoint}?${query}`;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        params?: Record<string, any>
    ): Promise<ApiResponse<T>> {
        const url = this.buildUrl(endpoint, params);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...API_CONFIG.headers,
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json() as T;

            if (!response.ok) {
                throw new Error((data as any)?.message || `HTTP ${response.status}`);
            }

            return {
                data,
                status: response.status,
            };
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    get<T>(endpoint: string, params?: Record<string, any>) {
        return this.request<T>(endpoint, { method: 'GET' }, params);
    }

    post<T>(endpoint: string, body: any, params?: Record<string, any>) {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: JSON.stringify(body),
            },
            params
        );
    }
}

export const apiClient = new ApiClient();