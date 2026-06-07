// app/me/index.tsx
import { Avatar } from "@/components/avatar";
import { getUserByUsername } from "@/features/users/users.api";
import { useAuth } from "@/hooks/use-auth";
import { UserResponse } from "@/types/users.types";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
    const router = useRouter();
    const { user: currentUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);

    const roleEmoji = useMemo(() => {
        switch (user?.role) {
            case 'admin':
                return { emoji: '👑' };
            case 'admin_bot':
                return { emoji: '😻' };
            case 'bot':
                return { emoji: '🤖' };
            default:
                return { emoji: '👤' };
        }
    }, [])

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.replace('/auth/login');
            return;
        }

        if (currentUser?.username) {
            fetchUser(currentUser.username);
        }
    }, [authLoading, isAuthenticated, currentUser]);

    const fetchUser = async (username: string) => {
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

    const handleLogout = () => {
        console.log('1. Button pressed');

        // Для Web платформы используем window.confirm
        const confirmed = window.confirm('Вы уверены, что хотите выйти?');

        if (confirmed) {
            console.log('Logout confirmed');
            logout();
            router.replace('/');
        } else {
            console.log('Logout cancelled');
        }
    };

    if (authLoading || loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Загрузка...</Text>
            </SafeAreaView>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
                <TouchableOpacity onPress={() => currentUser?.username && fetchUser(currentUser.username)}>
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
                <TouchableOpacity
                    onPress={() => router.push('/me/edit')}
                    style={{ position: 'absolute', right: 20, top: 20, zIndex: 1 }}>
                    <Text style={{ fontSize: 18, color: 'blue' }}>✏️ Редактировать</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Avatar avatarUrl={user.avatar_url} size={150} />
                    <View style={{ backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>Это вы</Text>
                    </View>
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
                            <Text style={{ fontSize: 12 }}>{roleEmoji.emoji} {user.role}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 14, color: '#999', marginTop: 15 }}>
                        Присоединился: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                        style={{ padding: 15, backgroundColor: '#ff4444', borderRadius: 8 }}
                        onPress={handleLogout}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Выйти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}