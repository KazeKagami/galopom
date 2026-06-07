import { Attraction } from "@/types/attractions.types";
import { Favorite } from "@/types/favorites.types";
import { StyleSheet, Text, View } from "react-native";

interface ItemProps {
    item: Attraction;
}

export function FavCard({ item }: ItemProps) {
    return (
        <View style={styles.card}>
            <Text>{item.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 2,
    }
})