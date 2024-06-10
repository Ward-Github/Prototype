import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import Status from './Status';
import HallOfShameAndFame from './HallOfShameAndFame';
import Feedback from './Feedback';
import { lightTheme, darkTheme } from '@/styles/Home/userHomeStyles';
import { useTheme } from '@/context/ThemeProvider';

const UserHome = () => {
  const auth = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHallOfFameVisible, setHallOfFameVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.profileHeader}>Home</Text>
      <Status setModalVisible={setModalVisible} />
      <HallOfShameAndFame isHallOfFameVisible={isHallOfFameVisible} setHallOfFameVisible={setHallOfFameVisible} />
      <Feedback isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
};

export default UserHome;
