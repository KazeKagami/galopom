import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Alert
} from 'react-native';

// Настройте ваш IP (замените на свой!)
// Windows: ipconfig -> IPv4-адрес
// Mac: ifconfig -> en0 -> inet
const API_BASE_URL = 'http://192.168.31.126:5000/api'; // ← ЗАМЕНИТЕ НА ВАШ IP!

interface Attraction {
    m_id: number;
    title: string;
    city: string;
    year_arise?: number;
}

export default function TestConnectionScreen() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [attractionId, setAttractionId] = useState('');
    const [singleAttraction, setSingleAttraction] = useState<Attraction | null>(null);

    // Тест 1: Проверка, жив ли сервер
    const testServerStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL.replace('/api', '')}`);
            const data = await response.json();
            setResponse({
                test: '✅ Сервер доступен',
                status: response.status,
                data: data
            });
        } catch (error: any) {
            setResponse({
                test: '❌ Ошибка подключения',
                error: error.message,
                hint: 'Проверьте: 1) Сервер запущен 2) IP адрес правильный 3) Порт 5000 открыт'
            });
        } finally {
            setLoading(false);
        }
    };

    // Тест 2: Получить все достопримечательности
    const getAllAttractions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/attractions`);
            const data = await response.json();
            setResponse({
                test: '📋 GET /attractions',
                count: data.length,
                firstThree: data.slice(0, 3),
                status: response.status
            });
        } catch (error: any) {
            setResponse({
                test: '❌ Ошибка',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    // Тест 3: Получить по ID
    const getAttractionById = async () => {
        if (!attractionId) {
            Alert.alert('Ошибка', 'Введите ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/attractions/${attractionId}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setSingleAttraction(data);
            setResponse({
                test: `🔍 GET /attractions/${attractionId}`,
                data: data,
                status: response.status
            });
        } catch (error: any) {
            setResponse({
                test: '❌ Ошибка',
                error: error.message
            });
            setSingleAttraction(null);
        } finally {
            setLoading(false);
        }
    };

    // Тест 4: POST - создать тестовую запись
    const createTestAttraction = async () => {
        setLoading(true);
        const testData = {
            title: `Тестовая достопримечательность ${new Date().toLocaleTimeString()}`,
            city: 'Тестовый город',
            type: 'тест',
            country: 'Тестовая страна'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/attractions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });
            const data = await response.json();
            setResponse({
                test: '✍️ POST /attractions (создание)',
                sent: testData,
                received: data,
                status: response.status
            });
        } catch (error: any) {
            setResponse({
                test: '❌ Ошибка POST',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>🔌 Тест связи Сервер ↔ Клиент</Text>
            <Text style={styles.subtitle}>API: {API_BASE_URL}</Text>

            {/* Кнопки тестов */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={testServerStatus}>
                    <Text style={styles.buttonText}>🏠 1. Статус сервера</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={getAllAttractions}>
                    <Text style={styles.buttonText}>📋 2. Все достопримечательности</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={createTestAttraction}>
                    <Text style={styles.buttonText}>✍️ 4. Создать тестовую</Text>
                </TouchableOpacity>
            </View>

            {/* Поиск по ID */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>3. Поиск по ID:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите ID (например, 1)"
                    value={attractionId}
                    onChangeText={setAttractionId}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.buttonSmall} onPress={getAttractionById}>
                    <Text style={styles.buttonText}>🔍 Найти</Text>
                </TouchableOpacity>
            </View>

            {/* Результат поиска по ID */}
            {singleAttraction && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>✅ Найдено:</Text>
                    <Text style={styles.resultText}>ID: {singleAttraction.m_id}</Text>
                    <Text style={styles.resultText}>Название: {singleAttraction.title}</Text>
                    <Text style={styles.resultText}>Город: {singleAttraction.city}</Text>
                    {singleAttraction.year_arise && (
                        <Text style={styles.resultText}>Год: {singleAttraction.year_arise}</Text>
                    )}
                </View>
            )}

            {/* Результаты тестов */}
            {response && (
                <View style={styles.responseCard}>
                    <Text style={styles.responseTitle}>📡 Результат:</Text>
                    <Text style={styles.responseText}>
                        {JSON.stringify(response, null, 2)}
                    </Text>
                </View>
            )}

            {loading && <ActivityIndicator size="large" color="#007AFF" />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    buttonGroup: {
        gap: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonSmall: {
        backgroundColor: '#34C759',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    inputGroup: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    resultCard: {
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    responseCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    responseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    responseText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#333',
    },
});