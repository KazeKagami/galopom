import { useMemo } from "react";
import { StyleSheet, useColorScheme, View, Text } from "react-native";
import { Attraction } from "../types/attractions.types";

interface ItemProps {
    item: Attraction;
    numColumns: number; // Передаем количество столбцов для адаптации
}

const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

// Компонент карточки достопримечательности с адаптивной длиной
export function AttractionCard({ item, numColumns }: ItemProps) {
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
        <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <Text style={styles.cardTitle} numberOfLines={numColumns === 1 ? 3 : 2}>
                {truncateText(item.title, limits.title)}
            </Text>

            <View style={styles.locationRow}>
                <Text style={styles.cardLocation} numberOfLines={1}>
                    {`📍 ${truncateText(locationText, limits.location)}`}
                </Text>
            </View>

            {item.year_arise && (
                <Text style={styles.cardYear}>
                    {`🏛️ ${item.year_arise} г.`}
                </Text>
            )}

            {item.description && (
                <Text
                    style={styles.cardDescription}
                    numberOfLines={numColumns === 1 ? 4 : (numColumns === 2 ? 3 : 2)}>
                    {truncateText(item.description, limits.description)}
                </Text>
            )}

            {!item.year_arise && !item.description && (
                <Text style={styles.cardEmpty}>
                    {'✨ Информация уточняется'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
})