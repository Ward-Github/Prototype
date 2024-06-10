import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAdminMode } from '@/context/AdminModeContext';

export default function TabLayout() {
  const { isAdminMode } = useAdminMode();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#21304f',
        tabBarInactiveTintColor: '#d8dce5', 
        tabBarStyle: { 
          backgroundColor: '#ffffff', 
          borderTopColor: 'transparent',
          height: 90,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          alignSelf: 'center',
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: '#f0f4f8',
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