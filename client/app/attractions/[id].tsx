import { getAttractionById } from "@/features/attractions/attractions.api";
import { Attraction } from "@/types/attractions.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AttractionDetailScreen() {
    // ✅ Получаем id из URL
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [isTrivia, setIstriviaOpen] = useState(true);

    const fetchAttraction = async () => {
        if (!id) {
            setError('ID не указан');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            setLoading(true);

            // ✅ Преобразуем string в number
            const attractionId = parseInt(id, 10);
            const resp = await getAttractionById(attractionId);
            setAttraction(resp.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAttraction();
    }, [id]);

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
                <TouchableOpacity onPress={fetchAttraction}>
                    <Text style={{ color: 'blue' }}>Повторить</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'gray' }}>Назад</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!attraction) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Данные не найдены</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Назад</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>← Назад</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        style={{ height: 500, width: 500 }}
                        source={require('@/assets/images/icon.png')}
                    />
                    <View>
                        <Text>
                            {attraction.title}
                        </Text>
                        <Text>
                            ID: {attraction.m_id}
                        </Text>
                        <Text>
                            Типы: {Array.isArray(attraction.kind)
                                ? attraction.kind.join(', ')
                                : String(attraction.kind || '—').replace(/([А-ЯЁ])/g, ' $1').trim()}
                        </Text>
                        <Text>
                            Авторы идеи: {attraction.idea_author}
                        </Text>
                        <Text>
                            Архитекторы: {attraction.architector}
                        </Text>
                        <Text>
                            Скульпторы: {attraction.sculptor}
                        </Text>
                        <Text>
                            Страна: {attraction.country}
                        </Text>
                        <Text>
                            Город: {attraction.city}
                        </Text>
                        <Text>
                            Адрес: {attraction.address}
                        </Text>
                        <Text>
                            Год возведения: {attraction.year_arise}
                        </Text>
                        <Text>
                            Другие названия: {attraction.other_titles}
                        </Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => setIsDescriptionOpen(!isDescriptionOpen)}
                        style={{ flexDirection: 'row' }}>
                        <Text>Описание</Text>
                        <Text>
                            {isDescriptionOpen ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {isDescriptionOpen && (
                        <View>
                            <Text>
                                {attraction.description || 'Информация скоро заполнится'}
                            </Text>
                        </View>
                    )}
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => setIsHistoryOpen(!isHistoryOpen)}
                        style={{ flexDirection: 'row' }}>
                        <Text>История</Text>
                        <Text>
                            {isHistoryOpen ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {isHistoryOpen && (
                        <View>
                            <Text>
                                {attraction.history || 'Информация скоро заполнится'}
                            </Text>
                        </View>
                    )}
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => setIstriviaOpen(!isTrivia)}
                        style={{ flexDirection: 'row' }}>
                        <Text>Факты</Text>
                        <Text>
                            {isTrivia ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {isTrivia && (
                        <View>
                            <Text>
                                {attraction.trivia || 'Информация скоро заполнится'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}