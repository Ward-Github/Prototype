import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Keyboard, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';

const submitFeedback = async ({ feedback, user, image }: { feedback: string, user: string, image?: string | null }) => {
  try {
    if (image) {
      await FileSystem.uploadAsync(
          `http://${process.env.EXPO_PUBLIC_API_URL}:3000/submit-feedback`,
          image!,
          {
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: 'image',
              httpMethod: 'POST',
              parameters: {
                  feedback: feedback,
                  user: user
              },
          },
      );
    } else {
      await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/submit-feedback`, { feedback, user }, { timeout: 5000 });
    }

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
  const [selectedProblem, setSelectedProblem] = useState('');
  const user = auth.user?.name || '';
  const [image, setImage] = useState<string | null>(null);

  const mutation = useMutation(({ feedback, user, image }: { feedback: string, user: string, image?: string | null }) => submitFeedback({ feedback, user, image }), {
    onSuccess: () => {
      setModalVisible(false);
      setFeedback('');
      setSelectedProblem('');
      setImage(null);
    },
    onError: () => {
      setModalVisible(false);
      setFeedback('');
      setSelectedProblem('');
      setImage(null);
    },
  });

  const problemOptions = [
    { key: '1', value: 'Payment not working' },
    { key: '2', value: 'Cable not charging' },
    { key: '3', value: 'Station unavailable' },
    { key: '4', value: 'Other' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeader}>Home</Text>
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
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>Pick an image (optional)</Text>
              {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Button 
                title="Send" 
                onPress={() => {
                  Keyboard.dismiss();
                  mutation.mutate({ 
                    feedback: selectedProblem === 'Other' ? feedback : selectedProblem, 
                    user,
                    image 
                  });
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
                  setImage(null);
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
  imagePicker: {
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#21304f',
    textDecorationLine: 'underline',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
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
    justifyContent : 'center',
  },
  dropdown: {
    backgroundColor: '#f0f4f8',
    borderColor: '#ddd',
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
