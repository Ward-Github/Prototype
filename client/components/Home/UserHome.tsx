import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';

const submitFeedback = async ({ feedback, user }: { feedback: string, user: string }) => {
  try {
    const response = await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/submitFeedback`, { feedback, user }, { timeout: 5000 });
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Success',
      text2: 'Problem reported successfully 🎉',
      visibilityTime: 3000,
      topOffset: 60,
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Error',
      text2: 'An error occurred while submitting your problem 😔',
      visibilityTime: 3000,
      topOffset: 60,
    });
    throw error;
  }
};

const UserHome = () => {
  const auth = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const user = auth.user?.name || '';

  const mutation = useMutation(({ feedback, user }: { feedback: string, user: string }) => submitFeedback({ feedback, user }), {
    onSuccess: () => {
      setModalVisible(false);
      setFeedback('');
    },
    onError: () => {
      setModalVisible(false);
      setFeedback('');
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeader}>Home</Text>
      <View style={styles.rectangle}>
        <Text style={styles.titleText}>Hi ward,</Text>
        <Text style={styles.subtitleText}>Your next reservation is at 14:00</Text>
      </View>
      <View style={styles.rectangle}>
        <Text style={styles.titleText}>Hi ward,</Text>
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
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report problem</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type your problem here..."
              placeholderTextColor="#A9A9A9"
              value={feedback}
              onChangeText={setFeedback}
            />
            <View style={styles.buttonContainer}>
            <Button 
              title="Send" 
              onPress={() => {
                Keyboard.dismiss();
                mutation.mutate({ feedback, user });
              }} 
            />
            <Button 
              title="Cancel" 
              color="red" 
              onPress={() => {
                Keyboard.dismiss();
                setModalVisible(false);
              }} 
            />
            </View>
            {mutation.isLoading && <ActivityIndicator size="large" color="#21304f" style={styles.loadingIndicator} />}
          </View>
        </View>
      </Modal>
    </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    color: '#21304f',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderColor: '#21304f',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default UserHome;
