import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import Toast from 'react-native-toast-message';
import { lightTheme, darkTheme } from '@/webstyles/indexStyles';
import axios from 'axios';
import moment from 'moment';

interface ReservationDetails {
  startTime: string;
  endTime: string;
  status: string;
  station: number;
}

const Status = ({ setModalVisible }: { setModalVisible: any }) => {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();

  const styles = theme === 'light' ? lightTheme : darkTheme;
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [started, setStarted] = useState(moment());
  const [update, setUpdate] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/status`, {
        params: { user: auth.user?.id },
      });
    
      if (response.data.message === 'No reservation') {
        setReservation(null);
        return;
      }

      setReservation(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }, [auth.user?.id]);

  useEffect(() => {
    if (auth.user) {
      auth.user.toUpdate = false;
    }

    fetchStatus();
  }, [auth.user?.toUpdate, fetchStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
      fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleStartReservation = async () => {
    try {
      await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/update-status`, {
        params: { id: auth.user?.id, status: 'started' },
      });

      fetchStatus();
      setStarted(moment());

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Reservation started successfully 🎉',
        visibilityTime: 3000,
        topOffset: 60,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEndReservation = async () => {
    try {
      await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/end-reservation`, {
        params: { id: auth.user?.id },
      });

      fetchStatus();

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Reservation ended successfully 🎉',
        visibilityTime: 3000,
        topOffset: 60,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderContent = () => {
    if (!reservation) {
      console.log('No reservation');
      return <Text style={styles.subtitleText}>No reservation</Text>;
    }

    console.log("----------------- Fetched reservation -----------------");
    console.log('Current time:', currentTime.format('HH:mm'));
    console.log('Start time:', reservation.startTime);
    console.log('End time:', reservation.endTime);

    const startTime = moment(reservation.startTime);
    const endTime = moment(reservation.endTime);

    if (currentTime.isBefore(startTime)) {
      return (
        <Text style={styles.subtitleText}>
          Your next reservation is at {startTime.format('HH:mm')}, be ready!
        </Text>
      );
    }

    else if (currentTime.isAfter(endTime) && reservation.status === 'started') {
      const isLate = moment().diff(moment(endTime), 'minutes') > 10;
      const feedbackMessage = isLate ? 'You are late! Shame +1' : 'End it now and get Fame +1';

      return (
        <>
          <Text style={styles.subtitleText}>
            Unplug your car, remove it from the station and press the red button to end the reservation
          </Text>
          <Text style={styles.subtitleText}>
            {feedbackMessage}
          </Text>
          <TouchableOpacity onPress={handleEndReservation} style={[styles.feedbackButton]}>
            <Text style={styles.feedbackButtonText}>End reservation</Text>
          </TouchableOpacity>
        </>
      );
    }

    else if (currentTime.isBetween(startTime, endTime)) {
      if (reservation.status === 'not_started') {
        return (
          <>
            <Text style={styles.subtitleText}>
              Plug your car in and press the green button to start the reservation
            </Text>
            <TouchableOpacity onPress={handleStartReservation} style={[styles.feedbackButton, styles.startButton]}>
              <Text style={styles.feedbackButtonText}>Start Reservation</Text>
            </TouchableOpacity>
          </>
        );
      } else if (reservation.status === 'started') {
        const duration = endTime.diff(started, 'minutes');
        const elapsed = currentTime.diff(started, 'minutes');
        const fill = (elapsed / duration) * 100;

        return (
          <>
            <Text style={styles.subtitleText}>
              Your car is currently charging
              {'\n'}
              Reservation: {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {'\n'}
              Started: {started.format('HH:mm')}
            </Text>
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={fill}
              tintColor="#21304f"
              backgroundColor="#d8dce5"
              rotation={0}
              lineCap="round"
              style={styles.circularProgress}
            >
              {() => (
                <View style={styles.progressContent}>
                  <MaterialCommunityIcons name="ev-station" size={24} color="#21304f" />
                  <Text style={styles.progressText}>Station {reservation.station}</Text>
                  <Text style={styles.progressText}>{Math.round(fill)}%</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.feedbackButton}>
              <Text style={styles.feedbackButtonText}>Report problem</Text>
            </TouchableOpacity>
          </>
        );
      }
    }

    return <Text style={styles.subtitleText}>No reservation</Text>;
  };

  return (
    <View>
      <Text style={styles.titleText}>Hi {auth.user?.name?.split(' ')[0]},</Text>
      {renderContent()}
    </View>
  );
};

export default Status;
