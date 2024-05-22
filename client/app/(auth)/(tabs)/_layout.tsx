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
        tabBarActiveTintColor: '#2196F3', // Change active tab color for admin mode
        tabBarInactiveTintColor: '#E1E1E1', // Change inactive tab color for admin mode
        tabBarStyle: { backgroundColor: isAdminMode ? '#1C1C1C' : '#0F2635', borderTopColor: 'transparent' }, // Change background color for admin mode
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: isAdminMode ? '#1C1C1C' : '#1B73E4' },
        headerTitleStyle: { fontFamily: 'Azonix' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name= "index"
        options={{
          title: (isAdminMode ? 'Chargers' : 'Home'),
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name={(isAdminMode ? 'battery-charging-outline' : 'home') as any} size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Azonix' }, // Increase the text size and set the font
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Reservation',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Azonix' }, // Increase the text size and set the font
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Azonix' }, // Increase the text size and set the font
        }}
      />
    </Tabs>
  );
}
