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
        tabBarActiveTintColor: '#007BFF', // Gray color for active tab icon
        tabBarInactiveTintColor: '#E1E1E1', // Gray color for inactive tab icon
        tabBarStyle: { 
          backgroundColor: '#0F2635', // Completely white tab bar background
          borderTopColor: 'transparent' 
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: '#041B2A', // Set header background to white
          height: 60, // Reduce header height
        },
        headerTitle: '', // Remove header text
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: (isAdminMode ? 'Chargers' : 'Home'),
          tabBarIcon: ({ color }) => <Ionicons name={(isAdminMode ? 'battery-charging-outline' : 'home')} size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins' }, // Increase the text size and set the font
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Reservation',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins' }, // Increase the text size and set the font
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={25} color={color} />, // Increase the size
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins' }, // Increase the text size and set the font
        }}
      />
    </Tabs>
  );
}
