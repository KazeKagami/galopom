// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { CustomTabBar } from '@/components/custom-tabbar';
import { usePathname } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();

  // Скрываем TabBar на страницах авторизации
  const hideTabBar = pathname.startsWith('/auth');

  return (
    <>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        {!hideTabBar && <CustomTabBar />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="attractions" />
          <Stack.Screen name="me" />
          <Stack.Screen name="users" />
          <Stack.Screen name="auth" />
        </Stack>
      </View>
    </>
  );
}