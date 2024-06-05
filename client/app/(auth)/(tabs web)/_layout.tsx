import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabOneScreen from '.';
import TabTwoScreen from './quickReserve';
import AdminScreenOne from './ChargingStations';
import AdminScreenTwo from './adminDashboard';
import { useAdminMode } from '@/context/AdminModeContext';
import TabThreeScreen from './three';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const isAdminMode = useAdminMode(); // Call the useAdminMode function to get the boolean value

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: '#E1E1E1',
        drawerStyle: { backgroundColor: '#0F2635' },
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
      {isAdminMode && (
        <>
          <Drawer.Screen
            name="chargingStations"
            component={AdminScreenOne}
            options={{
              title: 'Charging Stations',
              drawerIcon: ({ color }) => <Ionicons name="battery-charging" size={25} color={color} />,
              drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
            }}
          />
          <Drawer.Screen
            name="dashboard Admin"
            component={AdminScreenTwo}
            options={{
              title: 'Dashboard Admin',
              drawerIcon: ({ color }) => <Ionicons name="chatbox" size={25} color={color} />,
              drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
            }}
          />
          <Drawer.Screen
            name="Profile"
            component={TabThreeScreen}
            options={{
              title: 'Profile',
              drawerIcon: ({ color }) => <Ionicons name="person" size={25} color={color} />,
              drawerLabelStyle: { fontSize: 10, fontFamily: 'Azonix' },
            }}
          />
        </>
      )}

    </Drawer.Navigator>
  );
}