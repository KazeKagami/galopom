import { AttractionCard } from "@/components/attraction-card";
//import { FiltersCard } from "@/components/filters-card";
//import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Attraction } from "../../types/attractions.types";
import { getAttractions } from "@/features/attractions/attractions.api";
import { router } from "expo-router";


const cols = Platform.select({
    android: 1,
    ios: 1,
    web: 2,
    default: 2
})

export default function AttractionsExploreScreen() {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [sort, setSortBy] = useState<'title' | 'm_id'>('title');
    const [order, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAttractions = async () => {
        try {
            setError(null);
            setLoading(true);

            const params = {
                sort,
                order
            };

            let resp = await getAttractions(params);

            setAttractions(resp);
        }
        catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("Не удалось подключиться к серверу. Проверьте соединение.");
            } else {
                setError(err.message);
            }
        }
        finally {
            setLoading(false);
            setRefreshing(false)
        }
    }

    useEffect(() => {
        console.log(sort, order);
        fetchAttractions()
    }, [sort, order])

    const handleSort = (field: 'title' | 'm_id') => {
        setLoading(true);
        if (sort === field) {
            setOrderBy(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrderBy('asc');
        }
    };


    if (loading) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View>
                    <ActivityIndicator size="large" />
                    <Text>Загрузка достопримечательностей...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Отображение ошибки
    if (error) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View>
                    <Text style={{ fontSize: 24, fontStyle: 'italic', fontWeight: 'bold' }}>
                        Этот проект находится на разработке, и не является законченым продуктом! Сервак для теста и доступа без локалки
                    </Text>
                </View>
                <View>
                    <Text>
                        ⚠️ {error}
                    </Text>
                    <TouchableOpacity onPress={fetchAttractions}>
                        <Text>Повторить</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!attractions) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View style={styles.centered}>
                    <Text>Нет достопримечательностей</Text>
                    <TouchableOpacity onPress={fetchAttractions}>
                        <Text>Обновить</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.main_block}>
                    <View style={styles.header}>
                        <Text style={styles.main_block_title}>Достопримечательности</Text>
                        <Text style={styles.main_block_subtitle}>Найдено {attractions.length} объектов</Text>
                    </View>
                    <View style={styles.sort_line}>
                        <TouchableOpacity
                            onPress={() => handleSort('m_id')}>
                            <Text>ID {sort === 'm_id' ? (order === 'asc' ? '↑' : '↓') : ''}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSort('title')}>
                            <Text>Название {sort === 'title' ? (order === 'asc' ? '↑' : '↓') : ''}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={[...attractions]}
                        key={`${sort}-${order}`}
                        numColumns={cols}
                        columnWrapperStyle={{ gap: 10 }}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, height: 150 }}>
                                <TouchableOpacity onPress={() => router.push(`/attractions/${item.m_id}`)}>
                                    <AttractionCard item={item} numColumns={cols} />
                                </TouchableOpacity>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.m_id.toString()}
                        style={{ padding: 15 }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    cont: {
        flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    main_block: {
        flex: 1,
        padding: 20,
        borderRadius: 25,
    },
    header: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingBottom: 5,
        paddingTop: 5,
        justifyContent: 'space-between',

    },
    main_block_title: {
        fontWeight: 'bold',
        fontSize: 24
    },
    main_block_subtitle: {
        opacity: 0.5
    },
    sort_line: {
        flexDirection: 'row',
        paddingLeft: 15,
        opacity: 0.5,
        gap: 10
    }
})