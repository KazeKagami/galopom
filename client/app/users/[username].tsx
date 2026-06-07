// app/[username].tsx
import { Avatar } from "@/components/avatar";
import { getUserByUsername } from "@/features/users/users.api";
import { useAuth } from "@/hooks/use-auth";
import { UserResponse } from "@/types/users.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();
    const { user: currentUser, isAuthenticated } = useAuth();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwnProfile = isAuthenticated && currentUser?.username === username;

    const roleEmoji = useMemo(() => {
        console.log('Current user role:', user?.role); // 👈 Добавьте для отладки

        switch (user?.role) {
            case 'admin':
                return { emoji: '👑', label: 'admin' };
            case 'admin_bot':
                return { emoji: '😻', label: 'admin_bot' };
            case 'bot':
                return { emoji: '🤖', label: 'bot' };
            default:
                return { emoji: '👤', label: 'user' };
        }
    }, [user?.role]);

    // Если это свой профиль - редирект на /me
    useEffect(() => {
        if (isOwnProfile) {
            router.replace('/me');
            return;
        }

        if (username) {
            fetchUser();
        }
    }, [username, isOwnProfile]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const resp = await getUserByUsername(username);
            setUser(resp);
        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("Не удалось подключиться к серверу. Проверьте соединение.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Загрузка...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
                <TouchableOpacity onPress={fetchUser}>
                    <Text style={{ color: 'blue' }}>Повторить</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Пользователь не найден</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18 }}>← Назад</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Avatar avatarUrl={user.avatar_url} size={150} />
                </View>

                <View style={{ backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{user.username}</Text>
                        <TouchableOpacity
                            onPress={() => router.push(`/users/${user.username}/favorites`)}
                            style={{ backgroundColor: '#e0e0e0', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16 }}>⭐ Избранное</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>{user.email}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                            <Text style={{ fontSize: 12 }}>{`${roleEmoji.emoji} ${user.role}`}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 14, color: '#999', marginTop: 15 }}>
                        Присоединился: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}