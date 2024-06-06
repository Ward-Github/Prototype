import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Modal, ActivityIndicator, Keyboard } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';

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

const Feedback = ({ isModalVisible, setModalVisible }: { isModalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const user = auth.user?.name || '';

  const mutation = useMutation(({ feedback, user }: { feedback: string, user: string }) => submitFeedback({ feedback, user }), {
    onSuccess: () => {
      setModalVisible(false);
      setFeedback('');
      setSelectedProblem('');
    },
    onError: () => {
      setModalVisible(false);
      setFeedback('');
      setSelectedProblem('');
    },
  });

  const problemOptions = [
    { key: '1', value: 'Payment not working' },
    { key: '2', value: 'Cable not charging' },
    { key: '3', value: 'Station unavailable' },
    { key: '4', value: 'Other' },
  ];

  return (
    <Modal visible={isModalVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Report problem</Text>
          <SelectList
            setSelected={setSelectedProblem}
            data={problemOptions}
            save="value"
            placeholder="Select a problem"
            arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropdown}
            search={false}
          />
          {selectedProblem === 'Other' && (
            <TextInput
              style={styles.textInput}
              placeholder="Type your problem here..."
              placeholderTextColor="#A9A9A9"
              value={feedback}
              onChangeText={setFeedback}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              title="Send"
              onPress={() => {
                Keyboard.dismiss();
                mutation.mutate({ feedback: selectedProblem === 'Other' ? feedback : selectedProblem, user });
              }}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => {
                Keyboard.dismiss();
                setModalVisible(false);
                setFeedback('');
                setSelectedProblem('');
              }}
            />
          </View>
          {mutation.isLoading && <ActivityIndicator size="large" color="#21304f" style={styles.loadingIndicator} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  selectBox: {
    backgroundColor: '#f0f4f8',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    marginBottom: 20,
  },
  selectInput: {
    textAlign: 'center',
    color: '#333',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#f0f4f8',
    borderColor: '#ddd',
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

export default Feedback;
