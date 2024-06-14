import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { authenticate } from '@okta/okta-react-native';
import { useTheme } from '@/context/ThemeProvider';
import { lightTheme, darkTheme } from '@/styles/userTwoStyles';
import axios from 'axios';

export default function UserReservationScreen() {
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [desiredPercentage, setDesiredPercentage] = useState(20);
  const [defaultDesiredPercentage, setDefaultDesiredPercentage] = useState(20);
  const { theme, setTheme } = useTheme();

  const [slotsNeeded, setSlotsNeeded] = useState(0);
  const [selectedStartTimeIndex, setSelectedStartTimeIndex] = useState(0);
  const [selectedPriorityIndex, setSelectedPriorityIndex] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState("");
  const auth = useAuth();

  const handleReservation = async () => {

    if (desiredPercentage < batteryPercentage) {
      Alert.alert(
        "Ongeldige invoer",
        "Het gewenste percentage moet hoger zijn dan het huidige percentage"
      );
      return;
    }
    if (selectedPriority === "") {
      Alert.alert("Ongeldige invoer", "Selecteer een prioriteit");
      return;
    }
    if (selectedStartTime === "") {
      Alert.alert("Ongeldige invoer", "Selecteer een starttijd");
      return;
    }

    setSelectedPriorityIndex(getPriorityIndex(selectedPriority));
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_API_URL}:3000/create-reservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: auth.user?.id,
            startTime: startTimes[selectedStartTimeIndex],
            endTime: calculateEndTime(),
            priority: selectedPriorityIndex,
          }),
        }
      );

      Toast.show({
        type: "success",
        position: "top",
        text1: "Success",
        text2: `Reservation saved successfully 🎉`,
        visibilityTime: 3000,
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "An error occurred while making the reservation 😔",
        visibilityTime: 3000,
      });
    }
  };

  const calculateChargeTime = () => {
    const currentPercentage = parseInt(String(batteryPercentage), 10);
    const targetPercentage = parseInt(String(desiredPercentage), 10);

    // Haal de laadsnelheid van de auto op uit de profielgegevens (voorbeeld)
    const chargeSpeedKw = 22;

    // Schatting van de laadtijd in minuten (aanpassen indien nodig)
    // Laadtijd (in minuten) = ((Gewenste percentage - Huidig percentage) / 100 * Accucapaciteit (kWh)) / Laadvermogen (kW) * 60
    const chargeTimeMinutes = ((targetPercentage - currentPercentage) / 100 * 90) / chargeSpeedKw * 60;

    const slotsNeeded = Math.ceil(chargeTimeMinutes / 15);
    setSlotsNeeded(slotsNeeded);
    setSelectedStartTimeIndex(0); 
  };
  
  const [selectedStartTime, setSelectedStartTime] = useState('00:00'); // State voor de geselecteerde starttijd

  const startTimes = Array.from({ length: 13 * 4 }, (_, i) => {
    const hours = (Math.floor(i / 4) + 10) % 24;
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

  const priority = [
    { key: 1, value: 'Ik moet echt heel nodig laden!' },
    { key: 2, value: 'Ik wil graag laden' },
    { key: 3, value: 'Ik kan wel even wachten' },
    { key: 4, value: 'Ik heb geen haast, maar wil wel graag laden'},
    { key: 5, value: 'Eigenlijk hoeft het niet, maar laden is altijd handig'}
  ];

  const getPriorityIndex = (priority: string) => {
    switch (priority) {
      case 'Ik moet echt heel nodig laden!':
        return 1;
      case 'Ik wil graag laden':
        return 2;
      case 'Ik kan wel even wachten':
        return 3;
      case 'Ik heb geen haast, maar wil wel graag laden':
        return 4;
      case 'Eigenlijk hoeft het niet, maar laden is altijd handig':
        return 5;
      default:
        return 0;
    }
  };
  

  useEffect(() => {
    calculateChargeTime();
    setSelectedPriorityIndex(getPriorityIndex(selectedPriority));
  }, [batteryPercentage, desiredPercentage, selectedPriority]);

  const styles = theme == 'light' ? lightTheme : darkTheme;

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.profileHeader}>Laadpaal reserveren</Text>
        {/* dropdown menutje voor prio */}
        <View style={styles.inputContainer}></View>
          <Text style={styles.text}>Prioriteit:</Text>
          <SelectList 
            setSelected={setSelectedPriority} 
            data={priority} 
            save="value"
            placeholder="Selecteer prioriteit"
            arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
          />
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Huidig batterij %: {batteryPercentage}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
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

          <Text style={styles.sliderLabel}>Gewenst batterij %: {desiredPercentage}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={defaultDesiredPercentage}
            maximumValue={100}
            step={5}
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
        <Text style={styles.text}>Starttijd:</Text>
        <SelectList 
          setSelected={setSelectedStartTime} 
          data={data} 
          save="value"
          placeholder="Selecteer starttijd"
          arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
          boxStyles={styles.selectBox}
          inputStyles={styles.selectInput}
          dropdownStyles={styles.dropdown}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Geschatte eindtijd:</Text>
        {/* only show calculated charge time when desired percentage is higher than current */}
        <Text style={styles.text}>{desiredPercentage > batteryPercentage ? calculateEndTime() : 'Ongeldige invoer'}</Text>
      </View>
      <Pressable style={styles.button} onPress={handleReservation}>
        <Text style={styles.buttonText}>Reserveer</Text>
      </Pressable>
       </View>
    </View>
  );
}
