// types/auth.types.ts
export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at?: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    accessToken: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}