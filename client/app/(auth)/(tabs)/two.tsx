import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function TabTwoScreen() {
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [desiredPercentage, setDesiredPercentage] = useState(20);
  const [slotsNeeded, setSlotsNeeded] = useState(0);
  const [selectedStartTimeIndex, setSelectedStartTimeIndex] = useState(0);

  const handleReservation = async () => {
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test', // Vervang door de echte gebruikersnaam
          slots: slotsNeeded,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Reservation saved successfully 🎉',
        visibilityTime: 3000,
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'An error occurred while making the reservation 😔',
        visibilityTime: 3000,
      });
    }
  };

  const calculateChargeTime = () => {
    const currentPercentage = parseInt(String(batteryPercentage), 10);
    const targetPercentage = parseInt(String(desiredPercentage), 10);

    if (isNaN(currentPercentage) || isNaN(targetPercentage) || currentPercentage >= targetPercentage) {
      Alert.alert('Ongeldige invoer', 'Voer geldige percentages in.');
      return;
    }

    // Haal de laadsnelheid van de auto op uit de profielgegevens (voorbeeld)
    const chargeSpeedKw = 22; // Vervang door de daadwerkelijke waarde

    // Schatting van de laadtijd in minuten (aanpassen indien nodig)
    const chargeTimeMinutes = (targetPercentage - currentPercentage) * (120 / chargeSpeedKw);

    const slotsNeeded = Math.ceil(chargeTimeMinutes / 15);
    setSlotsNeeded(slotsNeeded);
    setSelectedStartTimeIndex(0); 
  };
  
  const [selectedStartTime, setSelectedStartTime] = useState('00:00'); // State voor de geselecteerde starttijd

  const startTimes = Array.from({ length: 24 * 4 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });

  const data = startTimes.map((time) => ({ key: time, value: time }));

  const calculateEndTime = () => {
    const [startHours, startMinutes] = selectedStartTime.split(':').map(Number);
    const totalMinutes = startHours * 60 + startMinutes + slotsNeeded * 15;
    const endHours = Math.floor(totalMinutes / 60) % 24; // Modulo 24 om binnen 24 uur te blijven
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    calculateChargeTime(); // Bereken tijdsloten automatisch bij verandering van percentages
  }, [batteryPercentage, desiredPercentage]); // Voer effect uit wanneer deze waarden veranderen

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Huidig batterijpercentage: {batteryPercentage}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={batteryPercentage}
            onValueChange={setBatteryPercentage}
            minimumTrackTintColor={
              batteryPercentage < 33 ? 'red' : batteryPercentage < 66 ? 'orange' : 'green'
            }
            maximumTrackTintColor="#ddd"
            thumbTintColor={
              batteryPercentage < 33 ? 'red' : batteryPercentage < 66 ? 'orange' : 'green'
            }
          />

          <Text style={styles.sliderLabel}>Gewenst batterijpercentage: {desiredPercentage}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={desiredPercentage}
            onValueChange={setDesiredPercentage}
            minimumTrackTintColor={
              desiredPercentage < 33 ? 'red' : desiredPercentage < 66 ? 'orange' : 'green'
            }
            maximumTrackTintColor="#ddd"
            thumbTintColor={
              desiredPercentage < 33 ? 'red' : desiredPercentage < 66 ? 'orange' : 'green'
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Benodigde tijdsloten: {slotsNeeded}</Text>
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.text}>Starttijd:</Text>
        <SelectList 
          setSelected={setSelectedStartTime} 
          data={data} 
          save="value"
          placeholder="Selecteer starttijd"
          arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
          boxStyles={{backgroundColor: '#2D6AA6', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}
          inputStyles={{color: '#fff'}}
          dropdownStyles={{backgroundColor: '#fff'}}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Geschatte eindtijd:</Text>
        <Text style={styles.text}>{calculateEndTime()}</Text>
      </View>
       </View>
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
    // backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    backgroundColor: '#041B2A', // Donkerblauwe achtergrond
  },
  rectangle: {
    width: '95%', 
    height: '95%', 
    backgroundColor: '#0F2635', // Donkerdere blauwe achtergrond voor rechthoek
    justifyContent: 'flex-start',
    alignItems: 'center', 
    paddingTop: 20,
  },
  // innerRectangle: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '95%',
  //   backgroundColor: '#0F3B5A', // Nog donkerdere blauwe achtergrond voor binnenste rechthoek
  // },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  // text: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#333',
  //   alignItems: 'center',
  //   margin: 15,
  // },
  text: {
    fontSize: 20,
    fontFamily: 'Azonix', // Aangepast lettertype (zorg dat dit geïnstalleerd is)
    color: '#E1E1E1', // Lichtgrijze tekstkleur
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '95%',
    margin: 10,
  },
  input: {
    backgroundColor: '#0F3B5A', // Donkerblauwe achtergrond voor inputvelden
    padding: 10,
    borderRadius: 5,
    width: '45%',
    color: '#E1E1E1', // Lichtgrijze tekstkleur in inputvelden
  },
  sliderContainer: {
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    color: '#E1E1E1', // Lichtgrijze labeltekst
    marginBottom: 5,
  },
});
