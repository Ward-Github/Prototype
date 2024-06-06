import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import Status from './Status';
import HallOfShame from './HallOfShame';
import Feedback from './Feedback';
import HallOfFame from './HallOfFame';

const UserHome = () => {
  const auth = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHallOfShameVisible, setHallOfShameVisible] = useState(false);
  const [isHallOfFameVisible, setHallOfFameVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.profileHeader}>Home</Text>
      <Status setModalVisible={setModalVisible} />
      <HallOfShame isHallOfShameVisible={isHallOfShameVisible} setHallOfShameVisible={setHallOfShameVisible} />
      <HallOfFame isHallOfFameVisible={isHallOfFameVisible} setHallOfFameVisible={setHallOfFameVisible} />
      <Feedback isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
};

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
    marginLeft: 20,
  },
});

export default UserHome;
