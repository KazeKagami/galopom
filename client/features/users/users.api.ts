// features/users/users.api.ts
import { apiClient } from "@/services/api.client"
import { Favorite } from "@/types/favorites.types";
import { UserResponse } from "@/types/users.types"
//import { getToken } from "@/utils/token-storage";

export const getUsers = async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/users');
    return response;
};

export const getUserByUsername = async (username: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(`/users/${username}`);
    return response;
};

export const updateMyProfile = async (data: {
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
}): Promise<UserResponse> => {
    console.log('Updating profile with data:', data);
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response;
};

export const getUserFavorites = async (username: string): Promise<Favorite[]> => {
    const response = await apiClient.get<Favorite[]>(`/users/${username}/favorites`);
    return response; // Возвращаем именно data, а не весь response
};

/*export const uploadAvatar = async (username: string, imageUri: string): Promise<{ avatarUrl: string }> => {
    const token = await getToken();

    // Создаем FormData для отправки файла
    const formData = new FormData();

    // Определяем тип файла по расширению
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
        uri: imageUri,
        name: filename,
        type: type,
    } as any);

    const response = await fetch(`http://localhost:5000/api/users/${username}/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // Не указываем Content-Type - fetch сам добавит с boundary
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload avatar');
    }

    const data = await response.json();
    return { avatarUrl: data.avatarUrl };
};*/