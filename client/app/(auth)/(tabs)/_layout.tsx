import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAdminMode } from '@/context/AdminModeContext';
import { useTheme } from '@/context/ThemeProvider';

export default function TabLayout() {
  const { isAdminMode } = useAdminMode();
  const { theme, setTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme == 'dark' ? '#ffffff' : '#21304f',
        tabBarInactiveTintColor: theme == 'dark' ? '#a9a9a9' : '#d8dce5', 
        tabBarStyle: { 
          backgroundColor: theme == 'light' ? '#ffffff' : '#1E1E1E', 
          borderTopColor: 'transparent',
          height: 90,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          alignSelf: 'center',
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: theme == 'light' ? '#f0f4f8' : '#121212',
          height: 60,
        },
        headerTitle: '',
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name={(isAdminMode ? 'battery-charging-outline' : 'home')} size={25} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name={(isAdminMode ? "desktop" : "calendar")} size={25} color={color} />,
          tabBarLabel: 'Reservation',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={25} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}