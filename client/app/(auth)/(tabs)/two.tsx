import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAdminMode } from '@/context/AdminModeContext';

import UserReservationScreen from '@/components/Two/UserReservation';
import AdminReservationScreen from '@/components/Two/AdminReservation';

export default function TabTwoScreen() {
  const { isAdminMode } = useAdminMode();

  return (
    <View style={styles.container}>
      {isAdminMode ? <AdminReservationScreen /> : <UserReservationScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
});