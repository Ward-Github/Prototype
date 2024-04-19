import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3', // Set the active tab color
        tabBarInactiveTintColor: '#E1E1E1', // Set the inactive tab color
        tabBarStyle: { backgroundColor: '#0F2635', borderTopColor: 'transparent' }, // Set the background color and margin top
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: '#1B73E4' },
        headerTitleStyle: { fontFamily: 'Azonix' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={25} color={color} />, // Increase the size
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