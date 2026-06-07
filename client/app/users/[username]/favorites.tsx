import { FavCard } from "@/components/favorite-card";
import { getAttractionById } from "@/features/attractions/attractions.api";
import { getUserFavorites } from "@/features/users/users.api";
import { Attraction } from "@/types/attractions.types";
import { Favorite } from "@/types/favorites.types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const cols = 1;

export default function MeFavoritesScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [attractions, setAttractions] = useState<Attraction[]>([]);

    const fetchFavorites = async (username: string) => {
        try {
            setLoading(true);
            setError(null);

            // Получаем массив избранного
            const favoritesList = await getUserFavorites(username);

            if (!Array.isArray(favoritesList)) {
                setFavorites([]);
                return;
            }

            setFavorites(favoritesList);

            // Получаем данные о достопримечательностях
            const attractionsData = await Promise.all(
                favoritesList.map(fav => getAttractionById(fav.m_id))
            );

            setAttractions(attractionsData);
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

    useEffect(() => {
        if (username) {
            fetchFavorites(username);
        }
    }, [username]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View>
                    <ActivityIndicator size="large" />
                    <Text>Загрузка Пользователей...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Отображение ошибки
    if (error) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View>
                    <Text>
                        ⚠️ {error}
                    </Text>
                    <TouchableOpacity onPress={() => username && fetchFavorites(username)}>
                        <Text>Повторить</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (favorites.length === 0) {
        return (
            <SafeAreaView style={[styles.cont]}>
                <View>
                    <Text>
                        {`У вас нет избранных достопримечательностей.\nПосмотрите каталог и выберите понравившиеся объекты.`}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/attractions')}>
                        <Text>В каталог</Text>
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
                        <Text style={styles.main_block_subtitle}>Найдено {favorites.length} объектов</Text>
                    </View>
                    <FlatList
                        data={[...attractions]}
                        numColumns={cols}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, height: 150 }}>
                                <TouchableOpacity onPress={() => router.push(`/attractions/${item.m_id}`)}>
                                    <FavCard item={item} />
                                </TouchableOpacity>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.m_id.toString()}
                        style={{ padding: 15 }} />
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