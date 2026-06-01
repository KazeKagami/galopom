// services/api.client.ts
import { API_CONFIG, API_URL } from '../config/api.config';

class ApiClient {
    private baseURL: string;
    private timeout: number;
    private accessToken: string | null = null;

    constructor() {
        this.baseURL = API_URL;
        this.timeout = API_CONFIG.timeout;
    }

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    private buildUrl(endpoint: string, params?: Record<string, any>): string {
        if (!params) return `${this.baseURL}${endpoint}`;

        const query = new URLSearchParams(params).toString();
        return `${this.baseURL}${endpoint}?${query}`;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
            console.log('✅ Token set in headers:', this.accessToken.substring(0, 20) + '...');
        } else {
            console.error('❌ NO ACCESS TOKEN in apiClient!');
        }

        return headers;
    }

    private async handleResponse(response: Response): Promise<any> {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `HTTP ${response.status}`);
        }

        return data;
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        return this.handleResponse(response);
    }

    async post<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });

        return this.handleResponse(response);
    }

    async put<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });

        return this.handleResponse(response);
    }

    async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        return this.handleResponse(response);
    }
}

export const apiClient = new ApiClient();