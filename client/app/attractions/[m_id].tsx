// app/attractions/[m_id].tsx
import { getAttractionById } from "@/features/attractions/attractions.api";
import { Attraction } from "@/types/attractions.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AttractionDetailScreen() {
    const { m_id } = useLocalSearchParams<{ m_id: string }>();
    const router = useRouter();

    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [isTrivia, setIsTriviaOpen] = useState(true);

    const fetchAttraction = async () => {
        if (!m_id) {
            setError('ID не указан');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const attractionId = parseInt(m_id, 10);
            const resp = await getAttractionById(attractionId);
            setAttraction(resp);
        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("Не удалось подключиться к серверу. Проверьте соединение.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAttraction();
    }, [m_id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Загрузка...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <View style={styles.errorContent}>
                    <Text style={styles.errorEmoji}>😢</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchAttraction} style={styles.button}>
                        <Text style={styles.buttonText}>Повторить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                        <Text style={styles.backLinkText}>Назад</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!attraction) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.notFoundText}>Данные не найдены</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>← Вернуться</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.heroImage}
                            source={require('@/assets/images/icon.png')}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.gradient}
                        />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{attraction.title}</Text>
                            <View style={styles.idBadge}>
                                <Text style={styles.idText}>ID: {attraction.m_id}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoGrid}>
                            {attraction.country && (
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>📍 Страна</Text>
                                    <Text style={styles.infoValue}>{attraction.country}</Text>
                                </View>
                            )}
                            {attraction.city && (
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>🏙️ Город</Text>
                                    <Text style={styles.infoValue}>{attraction.city}</Text>
                                </View>
                            )}
                            {attraction.year_arise && (
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>📅 Год создания</Text>
                                    <Text style={styles.infoValue}>{attraction.year_arise}</Text>
                                </View>
                            )}
                            {attraction.address && (
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>📮 Адрес</Text>
                                    <Text style={styles.infoValue}>{attraction.address}</Text>
                                </View>
                            )}
                        </View>

                        {/* Дополнительная информация */}
                        {(attraction.idea_author || attraction.architector || attraction.sculptor) && (
                            <View style={styles.authorsSection}>
                                <Text style={styles.sectionTitle}>👥 Создатели</Text>
                                {attraction.idea_author && (
                                    <View style={styles.authorRow}>
                                        <Text style={styles.authorLabel}>Идея:</Text>
                                        <Text style={styles.authorValue}>{attraction.idea_author}</Text>
                                    </View>
                                )}
                                {attraction.architector && (
                                    <View style={styles.authorRow}>
                                        <Text style={styles.authorLabel}>Архитектура:</Text>
                                        <Text style={styles.authorValue}>{attraction.architector}</Text>
                                    </View>
                                )}
                                {attraction.sculptor && (
                                    <View style={styles.authorRow}>
                                        <Text style={styles.authorLabel}>Скульптура:</Text>
                                        <Text style={styles.authorValue}>{attraction.sculptor}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Kind Tags */}
                        {attraction.kind && attraction.kind.length > 0 && (
                            <View style={styles.kindSection}>
                                <Text style={styles.sectionTitle}>🏷️ Тип</Text>
                                <View style={styles.kindContainer}>
                                    {Array.isArray(attraction.kind)
                                        ? attraction.kind.map((kind, index) => (
                                            <View key={index} style={styles.kindTag}>
                                                <Text style={styles.kindTagText}>{kind}</Text>
                                            </View>
                                        ))
                                        : (
                                            <View style={styles.kindTag}>
                                                <Text style={styles.kindTagText}>
                                                    {String(attraction.kind || '—').replace(/([А-ЯЁ])/g, ' $1').trim()}
                                                </Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </View>
                        )}

                        {/* Other Titles */}
                        {attraction.other_titles && (
                            <View style={styles.otherTitlesSection}>
                                <Text style={styles.sectionTitle}>📖 Также известен как</Text>
                                <Text style={styles.otherTitlesText}>{attraction.other_titles}</Text>
                            </View>
                        )}

                        {/* Collapsible Sections */}
                        <CollapsibleSection
                            title="📝 Описание"
                            isOpen={isDescriptionOpen}
                            onToggle={() => setIsDescriptionOpen(!isDescriptionOpen)}
                        >
                            <Text style={styles.contentText}>
                                {attraction.description || 'Информация скоро заполнится'}
                            </Text>
                        </CollapsibleSection>

                        <CollapsibleSection
                            title="📜 История"
                            isOpen={isHistoryOpen}
                            onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                        >
                            <Text style={styles.contentText}>
                                {attraction.history || 'Информация скоро заполнится'}
                            </Text>
                        </CollapsibleSection>

                        <CollapsibleSection
                            title="💡 Интересные факты"
                            isOpen={isTrivia}
                            onToggle={() => setIsTriviaOpen(!isTrivia)}
                        >
                            <Text style={styles.contentText}>
                                {attraction.trivia || 'Информация скоро заполнится'}
                            </Text>
                        </CollapsibleSection>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// Компонент для раскрывающихся секций
const CollapsibleSection = ({ title, isOpen, onToggle, children }: any) => (
    <View style={styles.collapsibleSection}>
        <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {isOpen && (
            <View style={styles.sectionContent}>
                {children}
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContent: {
        alignItems: 'center',
        padding: 20,
    },
    errorEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    notFoundText: {
        fontSize: 16,
        color: '#666',
    },
    imageContainer: {
        position: 'relative',
        height: 400,
        width: width,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    backLink: {
        marginTop: 12,
    },
    backLinkText: {
        color: '#007AFF',
        fontSize: 16,
    },
    titleContainer: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    idBadge: {
        backgroundColor: 'rgba(0,122,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    idText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    infoSection: {
        padding: 20,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    infoItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    authorsSection: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    authorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    authorLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    authorValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'right',
    },
    kindSection: {
        marginBottom: 24,
    },
    kindContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    kindTag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    kindTagText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
    },
    otherTitlesSection: {
        backgroundColor: '#fff3e0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    otherTitlesText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 8,
    },
    collapsibleSection: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    chevron: {
        fontSize: 14,
        color: '#8E8E93',
    },
    sectionContent: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e5e5ea',
    },
    contentText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});