import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'

export default function TabTwoScreen() {
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
              <MaterialCommunityIcons name="fast-forward-outline" size={56} color="#E1E1E1" style={{ marginRight: 20 }}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#041B2A',
  },
  rectangle: {
      width: '95%', 
      height: '95%', 
      backgroundColor: '#0F2635', 
      justifyContent: 'flex-start',
      alignItems: 'center', 
      paddingTop: 20,
  },
  innerRectangle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width : '95%',
      backgroundColor: '#0F3B5A',
  },
  textContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      marginRight: 20,
  },
  text: {
      fontSize: 28,
      fontFamily: 'Azonix',
      color: '#E1E1E1',
  },
});