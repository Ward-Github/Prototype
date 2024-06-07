import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import { lightTheme, darkTheme } from '@/styles/Home/userHomeStyles';

const Status = ({ setModalVisible }: { setModalVisible: any }) => {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={styles.rectangle}>
      <Text style={styles.titleText}>Hi {auth.user?.name?.split(' ')[0]},</Text>
      <Text style={styles.subtitleText}>Your car is currently charging</Text>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={60}
        tintColor="#21304f"
        backgroundColor="#d8dce5"
        rotation={0}
        lineCap="round"
        style={styles.circularProgress}
      >
        {() => (
          <View style={styles.progressContent}>
            <MaterialCommunityIcons name="ev-station" size={24} color="#21304f" />
            <Text style={styles.progressText}>Station 8</Text>
            <Text style={styles.progressText}>60%</Text>
          </View>
        )}
      </AnimatedCircularProgress>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.feedbackButton}>
        <Text style={styles.feedbackButtonText}>Report problem</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Status;
