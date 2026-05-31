// components/Avatar.tsx
import { Image } from 'react-native';
import { useState } from 'react';

interface AvatarProps {
    avatarUrl?: string | null;  // Получаем URL из пропсов
    size?: number;
}

export const Avatar = ({ avatarUrl, size = 150 }: AvatarProps) => {
    const [hasError, setHasError] = useState(false);

    // Дефолтный аватар (импортируем статически)
    const defaultAvatar = require('@/assets/avatars/NaNAvatar.png');

    // Если есть URL и нет ошибки - показываем аватар из сети
    if (avatarUrl && !hasError) {
        return (
            <Image
                style={{ width: size, height: size, borderRadius: size / 2 }}
                source={{ uri: avatarUrl }}
                onError={() => setHasError(true)}
            />
        );
    }

    // Если нет аватара или ошибка - показываем дефолтный
    return (
        <Image
            style={{ width: size, height: size, borderRadius: size / 2 }}
            source={defaultAvatar}
        />
    );
};