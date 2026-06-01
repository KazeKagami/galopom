// app/users/_layout.tsx
import { Stack } from 'expo-router';

export default function UsersLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Пользователи',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="[username]"
                options={{
                    title: 'Профиль',
                    headerShown: false
                }}
            />
        </Stack>
    );
}