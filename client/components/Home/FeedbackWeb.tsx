import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Modal, ActivityIndicator, Keyboard, Image, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useTheme } from '@/context/ThemeProvider';
import { darkTheme, lightTheme } from '@/webstyles/indexStyles';
import { useAuth } from '@/context/AuthProvider';

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

const FeedbackWeb = ({ isModalVisible, setModalVisible }: { isModalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const user = auth.user?.name || '';
  const { theme, setTheme } = useTheme();
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

  const styles = theme === 'light' ? lightTheme : darkTheme; 

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
  );
};

export default FeedbackWeb;
