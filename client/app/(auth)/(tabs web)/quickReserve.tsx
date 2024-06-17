import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserReservationScreen from '@/components/Two/UserReservation';

export default function TabTwoScreen() {

  return (
    <View style={styles.container}>
      <UserReservationScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
});
