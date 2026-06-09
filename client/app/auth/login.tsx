// screens/auth/LoginScreen.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Href, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { FormInput } from '@/components/form-input';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            await login(email, password);
            router.replace('/(tabs)'); // На главный экран
        } catch (error: any) {
            Alert.alert('Ошибка', error.message || 'Неверный email или пароль');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Добро пожаловать! 👋</Text>
                    <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
                </View>

                <View style={styles.test_cont}>
                    <Text style={styles.test_text_h1}>Тестовый пользователь:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.test_text_select}>Почта:</Text>
                        <Text style={styles.test_text_select}>test1@gmail.com</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.test_text_select}>Пароль:</Text>
                        <Text style={styles.test_text_select}>qwerty12345</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <FormInput
                        label="Email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={errors.email} />

                    <FormInput
                        label="Пароль"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password} />

                    {/*<TouchableOpacity
                        style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                    </TouchableOpacity>*/}

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Войти</Text>
                        )}
                    </TouchableOpacity>

                    {/*<View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Нет аккаунта? </Text>
                        <TouchableOpacity onPress={() => router.push('auth/register' as Href)}>
                            <Text style={styles.registerLink}>Зарегистрироваться</Text>
                        </TouchableOpacity>
                    </View>*/}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    test_cont: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        maxWidth: 300,
        borderRadius: 8,
        padding: 12,
        alignSelf: 'center',
        marginBottom: 12
    },
    test_text_h1: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    test_text_select: {
        fontSize: 16
    },
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
        marginBottom: 18,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});