// screens/auth/RegisterScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Href, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { FormInput } from '@/components/form-input';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (username.length < 3) {
            newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
        } else if (username.length > 30) {
            newErrors.username = 'Имя пользователя не более 30 символов';
        }

        if (!email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен';
        } else if (password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        try {
            await register(username, email, password);
            Alert.alert(
                'Успешно!',
                'Регистрация прошла успешно',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
            );
        } catch (error: any) {
            Alert.alert('Ошибка регистрации', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Создать аккаунт 🚀</Text>
                    <Text style={styles.subtitle}>Присоединяйтесь к нам!</Text>
                </View>

                <View style={styles.form}>
                    <FormInput
                        label="Имя пользователя"
                        placeholder="john_doe"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        error={errors.username}
                    />

                    <FormInput
                        label="Email"
                        placeholder="example@mail.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <FormInput
                        label="Пароль"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />

                    <FormInput
                        label="Подтверждение пароля"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Уже есть аккаунт? </Text>
                        <TouchableOpacity onPress={() => router.push('auth/login' as Href)}>
                            <Text style={styles.loginLink}>Войти</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        width: '100%',
    },
    registerButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});