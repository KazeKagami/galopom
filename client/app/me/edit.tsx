// app/me/edit.tsx
import { Avatar } from "@/components/avatar";
import { getUserByUsername, updateMyProfile } from "@/features/users/users.api";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/services/api.client";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
    const router = useRouter();
    const { user: currentUser, isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', avatar: '' });

    useEffect(() => {
        if (accessToken) {
            apiClient.setAccessToken(accessToken);
            console.log('✅ Token set in apiClient from edit screen');
        } else {
            console.log('❌ No accessToken available');
        }
    }, [accessToken]);

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
            setEditForm({
                username: resp.username || '',
                email: resp.email || '',
                avatar: resp.avatar_url || ''
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // В app/me/edit.tsx, функция handleSave:
    const handleSave = async () => {
        setSaving(true);
        try {
            // Проверяем, есть ли токен перед сохранением
            if (!accessToken) {
                throw new Error('Вы не авторизованы. Пожалуйста, войдите снова.');
            }

            const updateData: any = {};

            if (editForm.avatar !== currentUser?.avatar) {
                updateData.avatar = editForm.avatar;
            }

            if (editForm.username !== currentUser?.username) {
                updateData.username = editForm.username;
            }

            if (editForm.email !== currentUser?.email) {
                updateData.email = editForm.email;
            }

            // Если ничего не изменилось
            if (Object.keys(updateData).length === 0) {
                Alert.alert('Информация', 'Ничего не изменено');
                router.back();
                return;
            }

            await updateMyProfile(updateData);
            Alert.alert('Успех', 'Профиль успешно обновлен');
            router.back();
        } catch (err: any) {
            console.error('Save error:', err);
            Alert.alert('Ошибка', err.message || 'Не удалось обновить профиль');
        } finally {
            setSaving(false);
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

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.back()} disabled={saving}>
                    <Text style={{ fontSize: 18, color: 'red' }}>Отмена</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Редактировать</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    <Text style={{ fontSize: 18, color: saving ? '#ccc' : 'blue' }}>
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Avatar avatarUrl={editForm.avatar} size={120} />
                <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                    Аватар обновляется по URL
                </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Имя пользователя</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 }}
                    value={editForm.username}
                    onChangeText={(text) => setEditForm({ ...editForm, username: text })}
                    autoCapitalize="none"
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

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Ссылка на аватар (URL)</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 }}
                    value={editForm.avatar}
                    onChangeText={(text) => setEditForm({ ...editForm, avatar: text })}
                    placeholder="https://example.com/avatar.jpg"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                    Вставьте прямую ссылку на изображение
                </Text>
            </View>
        </SafeAreaView>
    );
}