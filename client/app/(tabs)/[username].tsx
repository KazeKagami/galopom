import { Avatar } from "@/components/avatar";
import { getUserByUsername } from "@/features/users/users.api";
import { useAuth } from "@/hooks/use-auth";
import { UserResponse } from "@/types/users.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();
    const { user: currentUser, isAuthenticated } = useAuth();

    const [user, setUser] = useState<UserResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', email: '' });
    //const [avatarKey, setAvatarKey] = useState(Date.now());

    const isOwnProfile = isAuthenticated && currentUser?.username === username;

    const fetchUser = async () => {
        if (!username) {
            setError('Username не указан');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const resp = await getUserByUsername(username);
            setUser(resp);
            setEditForm({ username: resp.username, email: resp.email })
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        Alert.alert('Успех', 'Профиль обновлен');
        setIsEditing(false);
        await fetchUser();
    }

    /*const handleAvatarUpdated = (newAvatarUrl: string) => {
        // Обновляем данные пользователя
        setUser(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : prev);
        setAvatarKey(Date.now()); // Принудительное обновление Image
    };*/

    useEffect(() => {
        fetchUser();
    }, [username]);

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
                <Text style={{ color: 'red', marginBottom: 20 }}>⚠️ {error}</Text>
                <TouchableOpacity onPress={fetchUser}>
                    <Text style={{ color: 'blue' }}>Повторить</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'gray' }}>Назад</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Данные не найдены</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Назад</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (isEditing && isOwnProfile) {
        return (
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => setIsEditing(false)}>
                        <Text style={{ fontSize: 18, color: 'red' }}>Отмена</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Редактировать</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={{ fontSize: 18, color: 'blue' }}>Сохранить</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Avatar avatarUrl={user.avatar_url} />
                    <TouchableOpacity style={{ marginTop: 10 }}>
                        <Text style={{ color: 'blue' }}>Изменить фото</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Имя пользователя</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 }}
                        value={editForm.username}
                        onChangeText={(text) => setEditForm({ ...editForm, username: text })}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Email</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 }}
                        value={editForm.email}
                        onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity style={{ marginTop: 20, padding: 15, backgroundColor: '#ff4444', borderRadius: 8 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Удалить аккаунт</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>

                {/* Кнопка редактирования (только для своего профиля) */}
                {isOwnProfile && (
                    <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        style={{ position: 'absolute', right: 20, top: 20, zIndex: 1 }}
                    >
                        <Text style={{ fontSize: 18, color: 'blue' }}>✏️ Редактировать</Text>
                    </TouchableOpacity>
                )}

                {/* Информация о пользователе */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Avatar avatarUrl={user.avatar_url} />

                    {/* Бейдж "Это вы" */}
                    {isOwnProfile && (
                        <View style={{ backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>Это вы</Text>
                        </View>
                    )}
                </View>

                <View style={{ backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{user.username}</Text>
                    <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>{user.email}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                            <Text style={{ fontSize: 12 }}>👑 {user.role}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 14, color: '#999', marginTop: 15 }}>
                        Присоединился: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </Text>
                </View>

                {/*{isOwnProfile && (
                    <View style={{ marginTop: 30 }}>
                        <TouchableOpacity
                            style={{ padding: 15, backgroundColor: '#ff4444', borderRadius: 8 }}
                            onPress={() => {
                                Alert.alert(
                                    'Выход',
                                    'Вы уверены, что хотите выйти?',
                                    [
                                        { text: 'Отмена', style: 'cancel' },
                                        {
                                            text: 'Выйти', onPress: () => {
                                                // logout logic
                                                router.replace('/auth/login');
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Выйти</Text>
                        </TouchableOpacity>
                    </View>
                )}*/}
            </View>
        </SafeAreaView>
    );
}