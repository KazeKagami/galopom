// app/attractions-list.tsx (обновленный компонент карточки)
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_URL } from "@/config/api.config";
import React, { useEffect, useState, useMemo } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
    Alert,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatGrid } from 'react-native-super-grid';

interface Attraction {
    m_id: number;
    title: string;
    city?: string;
    country?: string;
    description?: string;
    year_arise?: number;
    type?: string;
}

interface ItemProps {
    item: Attraction;
    numColumns: number; // Передаем количество столбцов для адаптации
}

// Вспомогательная функция для обрезки текста
const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

// Компонент карточки достопримечательности с адаптивной длиной
const AttractionCard = ({ item, numColumns }: ItemProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Определяем ограничения в зависимости от количества столбцов
    const limits = useMemo(() => {
        switch (numColumns) {
            case 1:
                return { title: 60, location: 40, description: 150 };
            case 2:
                return { title: 30, location: 25, description: 80 };
            case 3:
                return { title: 20, location: 18, description: 50 };
            case 4:
                return { title: 15, location: 15, description: 35 };
            default:
                return { title: 25, location: 20, description: 60 };
        }
    }, [numColumns]);

    // Формируем строку с местоположением (город, страна или оба)
    const locationText = useMemo(() => {
        if (item.city && item.country) {
            return `${item.city}, ${item.country}`;
        } else if (item.city) {
            return item.city;
        } else if (item.country) {
            return item.country;
        }
        return '📍 Местоположение не указано';
    }, [item.city, item.country]);

    return (
        <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            {/* Название - всегда показываем, обрезаем если длинное */}
            <ThemedText style={styles.cardTitle} numberOfLines={numColumns === 1 ? 3 : 2}>
                {truncateText(item.title, limits.title)}
            </ThemedText>

            {/* Местоположение - показываем если есть */}
            <View style={styles.locationRow}>
                <ThemedText style={styles.cardLocation} numberOfLines={1}>
                    📍 {truncateText(locationText, limits.location)}
                </ThemedText>
            </View>

            {/* Год - всегда показываем если есть */}
            {item.year_arise && (
                <ThemedText style={styles.cardYear}>
                    🏛️ {item.year_arise} г.
                </ThemedText>
            )}

            {/* Описание - показываем только если есть и ограничиваем по длине */}
            {item.description && (
                <ThemedText
                    style={styles.cardDescription}
                    numberOfLines={numColumns === 1 ? 4 : (numColumns === 2 ? 3 : 2)}
                >
                    {truncateText(item.description, limits.description)}
                </ThemedText>
            )}

            {/* Заглушка для пустых полей */}
            {!item.year_arise && !item.description && (
                <ThemedText style={styles.cardEmpty}>
                    ✨ Информация уточняется
                </ThemedText>
            )}
        </ThemedView>
    );
};

export default function AttractionsListScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [numColumns, setNumColumns] = useState(2);
    const [refreshing, setRefreshing] = useState(false);

    // Функция загрузки данных с API
    const fetchAttractions = async () => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/attractions`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setAttractions(data);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки данных');
            Alert.alert('Ошибка', 'Не удалось загрузить достопримечательности');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Проверка статуса сервера
    const checkServerStatus = async () => {
        try {
            const response = await fetch(API_URL.replace('/api', ''));
            if (response.ok) {
                Alert.alert('✅ Сервер доступен', 'API работает корректно');
                return true;
            }
        } catch (error: any) {
            Alert.alert(
                '❌ Сервер недоступен',
                `Проверьте:\n1. Запущен ли сервер\n2. IP адрес: ${API_URL}\n3. Порт 5000 открыт\n\nОшибка: ${error.message}`
            );
            return false;
        }
        return false;
    };

    // Функция для изменения количества столбцов
    const changeNumColumns = () => {
        const options = [2, 3, 4];
        const currentIndex = options.indexOf(numColumns);
        const nextIndex = (currentIndex + 1) % options.length;
        setNumColumns(options[nextIndex]);
    };

    // Обновление списка (pull-to-refresh)
    const onRefresh = () => {
        setRefreshing(true);
        fetchAttractions();
    };

    // Загружаем данные при монтировании
    useEffect(() => {
        fetchAttractions();
    }, []);

    // Получаем ширину экрана для расчета размеров
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth / numColumns - 12;

    // Отображение загрузки
    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
                    <ThemedText style={styles.loadingText}>Загрузка достопримечательностей...</ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    // Отображение ошибки
    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
                <View style={styles.centered}>
                    <ThemedText style={[styles.errorText, { color: isDark ? '#ff6b6b' : '#d32f2f' }]}>
                        ⚠️ {error}
                    </ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchAttractions}>
                        <ThemedText style={styles.retryButtonText}>Повторить</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkButton} onPress={checkServerStatus}>
                        <ThemedText style={styles.checkButtonText}>Проверить сервер</ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Пустое состояние
    if (attractions.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
                <View style={styles.centered}>
                    <ThemedText style={styles.emptyText}>Нет достопримечательностей</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchAttractions}>
                        <ThemedText style={styles.retryButtonText}>Обновить</ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
            {/* Хедер с управлением */}
            <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
                <View>
                    <ThemedText style={styles.title}>Достопримечательности</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Найдено {attractions.length} объектов
                    </ThemedText>
                </View>

                {/* Кнопка изменения количества столбцов */}
                <TouchableOpacity
                    style={[styles.columnButton, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}
                    onPress={changeNumColumns}
                >
                    <ThemedText style={styles.columnButtonText}>
                        {numColumns} 📱
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* Список с настраиваемыми столбцами */}
            <FlatGrid
                itemDimension={itemWidth}
                data={attractions}
                renderItem={({ item }) => (
                    <AttractionCard item={item} numColumns={numColumns} />
                )}
                spacing={8}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    checkButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
        opacity: 0.7,
    },
    columnButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    columnButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 120, // Минимальная высота
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 18,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardLocation: {
        fontSize: 12,
        opacity: 0.7,
        flex: 1,
    },
    cardYear: {
        fontSize: 11,
        opacity: 0.6,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 11,
        opacity: 0.8,
        marginTop: 4,
        lineHeight: 14,
    },
    cardEmpty: {
        fontSize: 11,
        opacity: 0.5,
        fontStyle: 'italic',
        marginTop: 4,
    },
});