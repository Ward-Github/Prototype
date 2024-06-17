import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import { darkTheme, lightTheme } from '@/webstyles/indexStyles';
import axios from 'axios';
import moment from 'moment';

interface ReservationDetails {
  startTime: string;
  endTime: string;
  status: string;
  station: number;
}

const StatusWeb = ({ setModalVisible }: { setModalVisible: any }) => {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();

  const styles = theme === 'light' ? lightTheme : darkTheme;
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [currentTime, setCurrentTime] = useState(moment());

  const fetchStatus = useCallback(async () => {
    console.log('Fetching status');
    console.log(auth.user?.id);

    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/status`, {
        params: { user: auth.user?.id },
      });
      console.log("\n\n\nfound data: ", response.data);
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
    }, 30000); // 60000 for 1 minute intervals

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const renderContent = () => {
    if (!reservation) {
      console.log('No reservation');
      return <Text style={styles.subtitleText}>No reservation</Text>;
    }

    console.log("----------------- Fetched reservation -----------------")
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

    if (currentTime.isBetween(startTime, endTime)) {
      if (reservation.status === 'not_started') {
        return (
          <Text style={styles.subtitleText}>
            Plug your car in and press the green button to start the reservation
          </Text>
        );
      } else if (reservation.status === 'started') {
        const duration = endTime.diff(startTime, 'minutes');
        const elapsed = currentTime.diff(startTime, 'minutes');
        const fill = (elapsed / duration) * 100;

        return (
          <View>
            <Text style={styles.subtitleText}>Your car is currently charging</Text>
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
          </View>
        );
      }
    }

    return <Text style={styles.subtitleText}>No reservation</Text>;
  };

  return (
    <View>
      <Text style={styles.titleText}>Hi {auth.user?.name?.split(' ')[0]},</Text>
        { renderContent() }
    </View>
  );
};

export default StatusWeb;
