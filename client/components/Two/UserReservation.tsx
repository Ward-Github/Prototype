import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { authenticate } from '@okta/okta-react-native';
import { useTheme } from '@/context/ThemeProvider';
import { lightTheme, darkTheme } from '@/styles/userTwoStyles';
import axios from 'axios';

interface ReservationDetails {
  startTime: string;
  endTime: string;
  priority: string;
}

export default function UserReservationScreen() {
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [desiredPercentage, setDesiredPercentage] = useState(20);
  const [defaultDesiredPercentage, setDefaultDesiredPercentage] = useState(20);
  const { theme, setTheme } = useTheme();

  const [slotsNeeded, setSlotsNeeded] = useState(0);
  const [selectedStartTimeIndex, setSelectedStartTimeIndex] = useState(0);
  const [selectedPriorityIndex, setSelectedPriorityIndex] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [chargingStationName, setChargingStationName] = useState("");
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);
  const [startTimes, setStartTimes] = useState<string[]>([]);
  const auth = useAuth();

  const handleReservation = async () => {
    if (desiredPercentage < batteryPercentage) {
      Alert.alert(
        "Invalid Input",
        "The desired percentage must be higher than the current percentage"
      );
      return;
    }
    if (selectedPriority === "") {
      Alert.alert("Invalid Input", "Please select a priority");
      return;
    }
    if (selectedStartTime === "") {
      Alert.alert("Invalid Input", "Please select a start time");
      return;
    }

    setLoading(true);
    setModalVisible(true);

    setSelectedPriorityIndex(getPriorityIndex(selectedPriority));
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/create-reservation`, {
        params: {
          username: auth.user?.id,
          startTime: startTimes[selectedStartTimeIndex],
          endTime: calculateEndTime(),
          priority: selectedPriorityIndex,
        },
      });

      setLoading(false);
      setChargingStationName(response.data);
      setReservationDetails({
        startTime: startTimes[selectedStartTimeIndex],
        endTime: calculateEndTime(),
        priority: selectedPriority,
      });
      if (auth.user) {
        auth.user.toUpdate = true;
      }
    } catch (error) {
      setLoading(false);
      setModalVisible(false);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "An error occurred while making the reservation 😔",
        visibilityTime: 3000,
      });
    }
  };

  const checkAvailability = async () => {
    if (desiredPercentage < batteryPercentage) {
      Alert.alert(
        "Invalid Input",
        "The desired percentage must be higher than the current percentage"
      );
      return;
    }
    if (selectedPriority === "") {
      Alert.alert("Invalid Input", "Please select a priority");
      return;
    }

    setCheckingAvailability(true);

    try {
      const timeNeededInHours = slotsNeeded * 15 / 60;
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/timeslots`, {
        params: {
          time: timeNeededInHours,
        },
      });

      setStartTimes(response.data);
      setCheckingAvailability(false);
    } catch (error) {
      setCheckingAvailability(false);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "An error occurred while checking availability 😔",
        visibilityTime: 3000,
      });
    }
  };

  const calculateChargeTime = () => {
    const currentPercentage = parseInt(String(batteryPercentage), 10);
    const targetPercentage = parseInt(String(desiredPercentage), 10);

    const chargeSpeedKw = 22;
    const chargeTimeMinutes = ((targetPercentage - currentPercentage) / 100 * 90) / chargeSpeedKw * 60;
    const slotsNeeded = Math.ceil(chargeTimeMinutes / 15);
    setSlotsNeeded(slotsNeeded);
    setSelectedStartTimeIndex(0);
  };

  const [selectedStartTime, setSelectedStartTime] = useState('00:00');

  const data = startTimes.map((time) => ({ key: time, value: time }));

  const calculateEndTime = () => {
    const [startHours, startMinutes] = selectedStartTime.split(':').map(Number);
    const totalMinutes = startHours * 60 + startMinutes + slotsNeeded * 15;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const priority = [
    { key: 1, value: 'I really need to charge!' },
    { key: 2, value: 'I would like to charge' },
    { key: 3, value: 'I can wait' },
    { key: 4, value: 'I am not in a hurry, but would like to charge' },
    { key: 5, value: 'I do not need to, but charging is always handy' }
  ];

  const getPriorityIndex = (priority: any) => {
    switch (priority) {
      case 'I really need to charge!':
        return 1;
      case 'I would like to charge':
        return 2;
      case 'I can wait':
        return 3;
      case 'I am not in a hurry, but would like to charge':
        return 4;
      case 'I do not need to, but charging is always handy':
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

  const resetState = () => {
    setBatteryPercentage(0);
    setDesiredPercentage(20);
    setSlotsNeeded(0);
    setSelectedStartTimeIndex(0);
    setSelectedPriorityIndex(0);
    setSelectedPriority("");
    setStartTimes([]);
    setReservationDetails(null);
    setModalVisible(false);
    setLoading(false);
    setCheckingAvailability(false);
    setChargingStationName("");
  };

  return (
    <View style={styles.container}>
      {checkingAvailability ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="#21304f" />
          <Text style={[styles.modalText, { fontSize: 18, marginTop: 10 }]}>Checking availability of the stations... 🤖</Text>
        </View>
      ) : (
        <>
          {!startTimes.length ? (
            <View style={styles.rectangle}>
              <Text style={styles.profileHeader}>Create reservation</Text>
              <View style={styles.inputContainer}></View>
                <Text style={styles.text}>Priority:</Text>
                <SelectList 
                  setSelected={setSelectedPriority} 
                  data={priority} 
                  save="value"
                  placeholder="Select priority"
                  arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
                  boxStyles={styles.selectBox}
                  inputStyles={styles.selectInput}
                  dropdownStyles={styles.dropdown}
                />
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Current Battery %: {batteryPercentage}%</Text>
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

                <Text style={styles.sliderLabel}>Desired Battery %: {desiredPercentage}%</Text>
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
              <Pressable style={styles.button} onPress={checkAvailability}>
                <Text style={styles.buttonText}>Check Availability</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.rectangle}>
              <Text style={styles.profileHeader}>Select Start Time</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.text}>Start Time:</Text>
                <SelectList 
                  setSelected={setSelectedStartTime} 
                  data={data} 
                  save="value"
                  placeholder="Select start time"
                  arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
                  boxStyles={styles.selectBox}
                  inputStyles={styles.selectInput}
                  dropdownStyles={styles.dropdown}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.text}>Estimated End Time:</Text>
                <Text style={styles.text}>{desiredPercentage > batteryPercentage ? calculateEndTime() : 'Invalid Input'}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={handleReservation}>
                  <Text style={styles.buttonText}>Reserve</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.cancelButton]} onPress={resetState}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="#21304f" />
                    <Text style={styles.modalText}>Getting station...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalHeader}>Reservation Details</Text>
                    <Text style={styles.modalText}>Charging station name: {chargingStationName}</Text>
                    {reservationDetails && (
                      <>
                        <Text style={styles.modalText}>Start time: {reservationDetails.startTime}</Text>
                        <Text style={styles.modalText}>End time: {reservationDetails.endTime}</Text>
                        <Text style={styles.modalText}>Priority: {reservationDetails.priority}</Text>
                      </>
                    )}
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        resetState();
                        Toast.show({
                          type: "success",
                          position: "top",
                          text1: "Success",
                          text2: `Reservation saved successfully 🎉`,
                          visibilityTime: 3000,
                          topOffset: 60,
                        });
                      }}
                    >
                      <Text style={styles.textStyle}>Confirm</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
