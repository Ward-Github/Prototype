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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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
  const [EvStation, setEvStation] = useState({
    id: "",
    name: "",
    maxPower: 0,
    status: "",
  });
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
     const response = await getRandomNonOccupiedEvStation();
     if (response === null) {
       return;
     }
    setSelectedPriorityIndex(getPriorityIndex(selectedPriority));
    console.log("EVSTATION ID: ", EvStation.id);
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_URL}:3000/reserve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: auth.user?.id,
            startTime: startTimes[selectedStartTimeIndex],
            endTime: calculateEndTime(),
            priority: selectedPriorityIndex,
            EvstationId: EvStation.id.toString(),
          }),
        }
      );
      await updateEvStationStatus(EvStation.id, "charging");
      if (!response.ok) {
        // throw error with status code
        throw new Error("Server error occurred while making the reservation 😔");
      }


      Toast.show({
        type: "success",
        position: "top",
        text1: "Success",
        text2: `Reservation saved successfully 🎉 \n
        Your Ev Station is ${EvStation.name}`,
        visibilityTime: 3000,
        topOffset: 60,
      });
      // reset form
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

  const getReservations = async () => {
    console.log("getReservations called");
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reservations`);
  
      if (!response.ok) {
        Alert.alert("An error occurred while fetching reservations");
      } else {
        const allReservations = await response.json();
  
        for (const reservation of allReservations) {
          // Extract hours and minutes from endTime (assuming HH:mm format)
          const [hours, minutes] = reservation.endTime.split(":").map(Number);
  
          // Create a Date object for the endTime 
          const endTimeDate = new Date();
          endTimeDate.setHours(hours, minutes, 0, 0); // Set time while keeping today's date
  
          console.log("Reservation end time:", endTimeDate);
  
          if (endTimeDate < new Date()) {
            resetEvStationstatus(reservation.EvStationId);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      Alert.alert("An error occurred while fetching reservations");
    }
  };
    const resetEvStationstatus = async (id : string) => {
    console.log("enter reset");
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/resetEvStationStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomNonOccupiedEvStation = async () => {
  try {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/getRandomNonOccupiedEvStation`);
    if (!response.ok) {
      Alert.alert("No available EV stations found");
      return null;
    }
    const data = await response.json();
    setEvStation(
      {
        id: data._id,
        name: data.name,
        maxPower: data.maxPower,
        status: data.status,
      }
    );
  } catch (error) {
    console.error(error);
  }
  }

  const updateEvStationStatus = async (id: string, status: string) => {
    console.log("updateEvStationStatus called with id:", id, "and status:", status);
    try {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/updateEvStationStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error('Server error');
    }
  } catch (error) {
    console.error(error);
  }
  }

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
    getReservations();
    calculateChargeTime(); // Bereken tijdsloten automatisch bij verandering van percentages
    setSelectedPriorityIndex(getPriorityIndex(selectedPriority));
  }, [batteryPercentage, desiredPercentage, selectedPriority]); // Voer effect uit wanneer deze waarden veranderen

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
          <Text style={styles.sliderLabel}>Huidig batterijpercentage: {batteryPercentage}%</Text>
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

          <Text style={styles.sliderLabel}>Gewenst batterijpercentage: {desiredPercentage}%</Text>
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
