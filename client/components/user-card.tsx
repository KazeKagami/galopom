import { UserResponse } from "@/types/users.types";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "./avatar";
import { useMemo } from "react";

interface ItemProps {
    item: UserResponse,
};

export function UserCard({ item }: ItemProps) {
    const roleEmoji = useMemo(() => {
        console.log('Current user role:', item?.role); // 👈 Добавьте для отладки

        switch (item?.role) {
            case 'admin':
                return { emoji: '👑', label: 'admin' };
            case 'admin_bot':
                return { emoji: '😻', label: 'admin_bot' };
            case 'bot':
                return { emoji: '🤖', label: 'bot' };
            default:
                return { emoji: '👤', label: 'user' };
        }
    }, [item?.role]);

    return (
        <View style={styles.card}>
            <View>
                <Avatar avatarUrl={item.avatar} size={72} />
            </View>
            <View style={styles.inter_view}>
                <Text style={styles.username}>
                    {`${item.username}`}
                </Text>
                <Text style={styles.role}>
                    {`${roleEmoji.emoji} ${item.role}`}
                </Text>
                <Text style={styles.register_date}>
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </Text>
            </View>
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
        minHeight: 120,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inter_view: {
        flexDirection: 'column',
        marginLeft: 25
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    role: {
        opacity: 0.5,
    },
    register_date: {
        opacity: 0.5,
    }

})