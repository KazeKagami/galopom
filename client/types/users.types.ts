export type UserResponse = {
    username: string,
    email: string,
    role: string,
    created_at: string,
    avatar?: string | null;  // 👈 Добавляем
    avatar_url?: string;
}