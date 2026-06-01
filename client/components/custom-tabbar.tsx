// components/CustomTabBar.tsx
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname, Href } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@/hooks/use-auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs: Array<{
    name: string;
    path: Href;  // 👈 Используем тип Href
    title: string;
    icon: string;
    showAlways?: boolean;
    requiresAuth?: boolean;
}> = [
        { name: 'index', path: '/', title: 'Главная', icon: 'home', showAlways: true },
        { name: 'explore', path: '/attractions', title: 'Поиск', icon: 'search', showAlways: true },
        { name: 'me', path: '/me', title: 'Профиль', icon: 'user', showAlways: false, requiresAuth: true },
    ];

export function CustomTabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    const visibleTabs = tabs.filter(tab => {
        if (tab.showAlways) return true;
        if (tab.requiresAuth && !isAuthenticated) return false;
        return true;
    });

    const isActive = (path: Href) => {
        const pathStr = String(path);
        if (pathStr === '/' && pathname === '/') return true;
        if (pathStr !== '/' && pathname.startsWith(pathStr)) return true;
        return false;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {visibleTabs.map((tab) => (
                    <TouchableOpacity
                        key={String(tab.path)}
                        style={styles.tab}
                        onPress={() => router.push(tab.path)}
                    >
                        <Feather
                            name={tab.icon as any}
                            size={24}
                            color={isActive(tab.path) ? '#007AFF' : '#8E8E93'}
                        />
                        <Text style={[styles.label, isActive(tab.path) && styles.activeLabel]}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,        // 👈 border снизу вместо сверху
        borderBottomColor: '#e0e0e0',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingBottom: 8,
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 4,
    },
    activeLabel: {
        color: '#007AFF',
    },
});