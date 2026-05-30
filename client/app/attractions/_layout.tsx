import { Stack } from "expo-router";

export default function AttractionsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}

// Добавьте эту настройку для очистки параметров
export const unstable_settings = {
    // Очищает query параметры при навигации
    initialRouteName: '[id]',
};