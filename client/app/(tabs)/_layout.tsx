import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@/hooks/use-auth';

export default function TabLayout() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{

        headerShown: false,
        tabBarButton: HapticTab,
        tabBarPosition: "top",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          href: isAuthenticated && user?.username
            ? `/${user.username}`
            : '/auth/login',
        }} />
    </Tabs>
  );
}
