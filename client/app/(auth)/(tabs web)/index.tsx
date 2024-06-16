import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Keyboard, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { darkTheme, lightTheme } from '@/webstyles/indexStyles';
import { useTheme } from '@/context/ThemeProvider';

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

const ReportProblemModal = () => {
  const auth = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const user = auth.user?.name || '';
  const [image, setImage] = useState<string | null>(null);
  const { theme } = useTheme();

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
    <View style={styles.flexBoxesRight}>
      <Text style={styles.titleText}>Report a problem</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.feedbackButton}>
        <Text style={styles.feedbackButtonText}>Report problem</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report your problem</Text>
            <View style={styles.dropdownContainer}>
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
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <MaterialCommunityIcons name="upload" size={24} color="#21304f" />
                {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
              </TouchableOpacity>
            </View>
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
                  mutation.mutate({ feedback: selectedProblem === 'Other' ? feedback : selectedProblem, user, image });
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
  const { theme } = useTheme();

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
  ];

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftRectangle}>
        <Text style={styles.titleText}>LOADING STATIONS</Text>
      </View>
      <View style={styles.rightRectanglesContainer}>
        <View style={styles.flexBoxesRight}>
          <Text style={styles.titleText}>FAST RESERVATION</Text>
          <SelectList
            boxStyles={{backgroundColor: '#21304f', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
            setSelected={(val: React.SetStateAction<string>) => setSelected(val)}
            data={data}
            save="value"
            placeholder="TIME"
            fontFamily='Azonix'
            search={false}
            arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
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
