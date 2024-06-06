import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '@/context/AuthProvider';

const Status = ({ setModalVisible }: { setModalVisible: any }) => {
  const auth = useAuth();

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

const styles = StyleSheet.create({
  rectangle: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  titleText: {
    fontSize: 32,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
  },
  subtitleText: {
    fontSize: 24,
    color: '#21304f',
    marginTop: 20,
  },
  circularProgress: {
    marginTop: 20,
    alignSelf: 'center',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#21304f',
    marginTop: 5,
  },
  feedbackButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Status;
