import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Keyboard, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';

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

const ReportProblemModal = () => {
  const auth = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
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
  })

  const problemOptions = [
    { key: '1', value: 'Payment not working' },
    { key: '2', value: 'Cable not charging' },
    { key: '3', value: 'Station unavailable' },
    { key: '4', value: 'Other' },
  ];

  return (
    <View style={styles.flexBoxesRight}>
        <Text style={styles.titleText}>Report a problem</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.feedbackButton}>
        <Text style={styles.feedbackButtonText}>Report problem</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report your problem</Text>
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
                style={[styles.textInput, {marginTop: 20}]}
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
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(false);
                  setFeedback('');
                  setSelectedProblem('');
                }} 
                color="red" 
              />
            </View>
            {mutation.isLoading && <ActivityIndicator size="large" color="#21304f" style={styles.loadingIndicator} />}
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default function TabOneScreen() {

  const { user } = useAuth();
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: '1', value: '08:00 - 09:00' },
    { key: '2', value: '09:00 - 10:00' },
    { key: '3', value: '10:00 - 11:00' },
    { key: '4', value: '11:00 - 12:00' },
    { key: '5', value: '12:00 - 13:00', disabled: true },
    { key: '6', value: '13:00 - 14:00', disabled: true },
    { key: '7', value: '14:00 - 15:00' },
    { key: '8', value: '15:00 - 16:00' },
    { key: '9', value: '16:00 - 17:00' },
    { key: '10', value: '17:00 - 18:00' },
    { key: '11', value: '18:00 - 19:00', disabled: true },
    { key: '12', value: '19:00 - 20:00' },
    { key: '13', value: '20:00 - 21:00' },
    { key: '14', value: '21:00 - 22:00' },
  ]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftRectangle}>
        <Text style={styles.titleText}>LOADING STATIONS</Text>
      </View>
      <View style={styles.rightRectanglesContainer}>

        <View style={styles.flexBoxesRight}>
          <Text style={styles.titleText}>FAST RESERVATION</Text>
          <SelectList
            setSelected={(val: React.SetStateAction<string>) => setSelected(val)}
            data={data}
            save="value"
            placeholder="TIME"
            fontFamily='Azonix'
            search={false}
            arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
            boxStyles={{ backgroundColor: '#21304f', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
            inputStyles={{ color: '#fff' }}
            dropdownStyles={{ backgroundColor: '#fff' }}
          />
        </View>

        <View style={[styles.flexBoxesRight, { alignItems: 'center' }]}>
          <Text style={styles.titleText}>TESLA MODEL Y</Text>
          <Image source={require('../../../assets/images/image.png')} style={styles.image} />
          <View style={styles.line} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text}>{user?.licensePlate}</Text>
          </View>
          
        </View>

        <View style={styles.flexBoxesRight}>
          <Text style={styles.titleText}>RESERVATION DETAILS</Text>
        </View>
        <ReportProblemModal />
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f4f8',
    justifyContent: 'space-evenly',
    flexBasis: '100%',
    padding: 5,
  },
  leftRectangle: {
    flex: 1,
    flexBasis: '50%',
    backgroundColor: '#fff',
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 30,
    padding: 30,
    borderRadius: 20,
  },
  rightRectanglesContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 30,
    marginRight: 30,
    borderRadius: 20,
    rowGap: 30,
    flexBasis: '50%',
    flexGrow: 0,
    justifyContent: 'space-evenly',    
  },
  flexBoxesRight: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    maxHeight: '50%',
    width: '45%',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: '45%',
    minHeight: '40%',
    overflow: 'hidden',
  },
  line: {
    height: 1,
    backgroundColor: '#E1E1E1',
    width: '90%',
    marginBottom: 20,
    
  },
  titleText: {
    fontSize: 32,
    color: '#21304f',
    marginBottom: 20,
    fontFamily: 'Azonix',
    textAlign: 'center',
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: 24,
    color: '#E1E1E1',
    fontFamily: 'Azonix',
  },
  text: {
    fontSize: 28,
    color: '#21304f',
    fontFamily: 'Azonix',
    flexShrink: 1,

  },
  image: {
    width: "75%",
    height: "40%",
    marginTop: 20,
    marginBottom: 20,
    minHeight: "35%",
    minWidth: "35%",
    flexShrink: 1,
  },
  modalIcon: {
    minHeight: "5%",
    minWidth: "5%",
  },
  feedbackButton: {
    backgroundColor: '#21304f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '30%',
  },
  modalTitle: {
    fontSize: 24,
    color: '#21304f',
    fontWeight: '700',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 30,
    borderRadius: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  selectBox: {
    backgroundColor: '#f0f4f8',
    borderColor: 'transparent',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectInput: {
    color: '#21304f',
    fontWeight: '700',
  },
  dropdown: {
    backgroundColor: '#f0f4f8',
  },
});
