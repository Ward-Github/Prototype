import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator, Keyboard, Image, ScrollView, Pressable, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';

const fetchHallOfShame = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/hall-of-shame`);
  console.log(response.data);
  return response.data;
};

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
  const queryClient = useQueryClient();
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [isHallOfShameVisible, setHallOfShameVisible] = useState(false);
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

  const { data: hallOfShameData, isLoading: isLoadingHallOfShame, refetch: refetchHallOfShame } = useQuery('hallOfShame', fetchHallOfShame);

  useEffect(() => {
    if (isHallOfShameVisible) {
      refetchHallOfShame();
    }
  }, [isHallOfShameVisible]);

  const problemOptions = [
    { key: '1', value: 'Payment not working' },
    { key: '2', value: 'Cable not charging' },
    { key: '3', value: 'Station unavailable' },
    { key: '4', value: 'Other' },
  ];

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.shameRectangle}>
        <Text style={styles.shameTitle}>The hall of shame 🤡</Text>
        <Text style={styles.barelyReadableText}>(make fun of this person)</Text>
        {isLoadingHallOfShame ? (
          <ActivityIndicator size="large" color="#21304f" />
        ) : hallOfShameData && hallOfShameData.length > 0 ? (
          <View style={styles.shameContainer}>
            <View style={styles.shameItem}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[1]._pfp}` }} style={[styles.shameImageSmall, styles.silverBorder]} />
              <Text style={styles.shameText}>#{2} {hallOfShameData[1]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.shameItem}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[0]._pfp}` }} style={[styles.shameImageLarge, styles.goldBorder]} />
              <Text style={styles.shameText}>#{1} {hallOfShameData[0]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.shameItem}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[2]._pfp}` }} style={[styles.shameImageSmall, styles.bronzeBorder]} />
              <Text style={styles.shameText}>#{3} {hallOfShameData[2]._name.split(' ')[0]}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noShameText}>No one to shame yet.</Text>
        )}
        {hallOfShameData && hallOfShameData.length > 0 && (
          <TouchableOpacity onPress={() => setHallOfShameVisible(true)} style={styles.viewShameButton}>
            <Text style={styles.viewShameButtonText}>View full hall of shame</Text>
          </TouchableOpacity>
        )}
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

      <Modal
        visible={isHallOfShameVisible}
        onRequestClose={() => setHallOfShameVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hall of Shame</Text>
              <Pressable onPress={() => setHallOfShameVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={hallOfShameData}
              renderItem={({ item, index }) => (
                <View style={styles.fullShameItem}>
                  <Image
                    source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }}
                    style={[
                      styles.fullShameImage,
                      index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder
                    ]}
                  />
                  <Text style={styles.fullShameText}>
                    #{index + 1} - {item._name} | {item._shame}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.fullShameContainer}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: '#21304f',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#21304f',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  textInput: {
    width: '100%',
    borderColor: '#21304f',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  shameRectangle: {
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
  shameTitle: {
    fontSize: 24,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
  },
  barelyReadableText: {
    fontSize: 10,
    color: '#21304f',
    marginBottom: 10,
  },
  shameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  shameItem: {
    alignItems: 'center',
  },
  shameImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  shameImageSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
  },
  goldBorder: {
    borderColor: '#FFD700',
  },
  silverBorder: {
    borderColor: '#C0C0C0',
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
  },
  shameText: {
    marginTop: 5,
    fontSize: 16,
    color: '#21304f',
  },
  viewShameButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#21304f',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewShameButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noShameText: {
    fontSize: 16,
    color: '#21304f',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  fullShameContainer: {
    width: '100%',
    padding: 20,
  },
  fullShameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  fullShameImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 3,
  },
  fullShameText: {
    fontSize: 16,
    color: '#21304f',
  },
});

export default UserHome;
