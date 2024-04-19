import { StyleSheet, Image } from 'react-native';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.rectangle}>
            <Text style={styles.titleText}>TESLA MODEL Y</Text>
            <Image source={require('../../assets/images/image.png')} style={styles.image} />
            <View style={styles.line} />
            <View style={styles.stationContainer}>
                <MaterialCommunityIcons name="ev-station" size={40} color="#E1E1E1" />
                <Text style={styles.text}> STATION 8</Text>
            </View>
            <View style={styles.batteryContainer}>
                <MaterialCommunityIcons name="battery-charging" size={40} color="green"/>
                <Text style={styles.text}> 46%</Text>
            </View>
            <Text style={styles.subtitleText}>REMAINING CHARGE TIME:</Text>
            <Text style={styles.text}>1H : 34M</Text>
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
      paddingTop: 60,
  },
  line: {
      height: 1,
      backgroundColor: '#E1E1E1',
      width: '90%',
      marginTop: 20,
      marginBottom: 20,
  },
  titleText: {
      fontSize: 32,
      color: '#E1E1E1',
      marginBottom: 20,
      fontFamily: 'Azonix',
  },
  subtitleText: {
      fontSize: 24,
      color: '#E1E1E1',
      marginTop: 20,
      fontFamily: 'Azonix',
  },
  text: {
      fontSize: 28,
      color: '#E1E1E1',
      fontFamily: 'Azonix',
  },
  image: {
      width: 350,
      height: 150,
      marginTop: 20,
      marginBottom: 20,
  },
  stationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
  },
  batteryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
  },
});
