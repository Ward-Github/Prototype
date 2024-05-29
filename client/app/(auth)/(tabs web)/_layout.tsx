import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabOneScreen from '.';
import TabTwoScreen from './quickReserve';
import TabThreeScreen from './three';
import { useAdminMode } from '@/context/AdminModeContext';
import adminScreen from './adminScreen';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#2196F3', // Set the active drawer item color
        drawerInactiveTintColor: '#E1E1E1', // Set the inactive drawer item color
        drawerStyle: { backgroundColor: '#0F2635' }, // Set the background color
        headerStyle: { backgroundColor: '#1B73E4' },
        headerTitleStyle: { fontFamily: 'Azonix' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      }}>
      <Drawer.Screen
        name="index"
        component={TabOneScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home" size={25} color={color} />,
          drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
        }}
      />
      <Drawer.Screen
        name="two"
        component={TabTwoScreen}
        options={{
          title: 'Reservation',
          drawerIcon: ({ color }) => <Ionicons name="calendar" size={25} color={color} />,
          drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
        }}
      />
      <Drawer.Screen
        name="three"
        component={TabThreeScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => <Ionicons name="person" size={25} color={color} />,
          drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
        }}
      />
      {useAdminMode() && (
        <Drawer.Screen
          name="admin"
          component={adminScreen}
          options={{
            title: 'Admin',
            drawerIcon: ({ color }) => <Ionicons name="settings" size={25} color={color} />,
            drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
          }}
        />
      )}
    </Drawer.Navigator>
  );
}