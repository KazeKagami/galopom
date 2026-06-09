import { useAuth } from "@/hooks/use-auth";
import LoginScreen from "../auth/login";
import { Text, View } from "react-native";

// app/(tabs)/index.tsx (главный экран)
export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>👋 Привет, {user?.username}!</Text>
      <Text>📧 {user?.email}</Text>
      <Text>👑 Роль: {user?.role}</Text>
      <Text>✅ Сессия активна</Text>

      {/*<TouchableOpacity>
        <Text>Выйти</Text>
      </TouchableOpacity>*/}
    </View>
  );
}