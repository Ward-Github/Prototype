import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function UserReservationScreen() {
  const handlePress = () => {
    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'test' }),
    })
    .then(response => {
      if (!response.ok) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: `An error occurred while making the reservation 😔`,
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: 'Reservation saved successfully 🎉',
          visibilityTime: 3000,
          topOffset: 60,
        });
      }
    })
    .catch((error) => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: `An error occurred while making the reservation 😔`,
        visibilityTime: 3000,
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeader}>Reservation</Text>
      <Pressable onPress={handlePress}>
        <View style={styles.innerRectangle}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>FAST</Text>
            <Text style={styles.text}>RESERVATION</Text>
          </View>
          <MaterialCommunityIcons name="fast-forward-outline" size={56} color="#041B2A" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  profileHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#21304f',
    marginTop: 20,
    marginHorizontal: 20,
  },
  innerRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});
