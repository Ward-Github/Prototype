import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'
import { lightTheme, darkTheme } from '@/webstyles/quickReserveStyles';
import { useTheme } from '@/context/ThemeProvider';
import { useState } from 'react';

export default function TabTwoScreen() {
  const { theme } = useTheme();
  const styles = theme === 'light' ? lightTheme : darkTheme;
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      }
      else {
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
      console.error('Error:', error);
      // Display an error toast
  
    });
  }

    return (
      <View style={styles.container}>
        <View style={styles.rectangle}>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.innerRectangle}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>SNEL</Text>
                <Text style={styles.text}>RESERVEREN</Text>
                </View>
          <MaterialCommunityIcons
            name="fast-forward-outline"
            size={56}
            color={isDarkMode ? '#E1E1E1' : '#21304f'}
            style={styles.icon}
          />
        </View>
          </TouchableOpacity>
        </View>
      </View>
    );
}