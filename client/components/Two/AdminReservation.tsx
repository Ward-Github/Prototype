import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, Image, TextInput, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeProvider';
import { lightTheme, darkTheme } from '@/styles/adminTwoStyles';
import { Ionicons } from '@expo/vector-icons';

const fetchReservations = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reservations`);
  return response.data.reverse();
};

const fetchFeedback = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/feedback`);
  console.log(response.data);
  return response.data.reverse();
};

const fetchUsers = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/users`);
  return response.data;
};

export default function AdminReservationScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isUsersModalVisible, setIsUsersModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: reservations,
    error: reservationsError,
    isLoading: reservationsLoading,
    refetch: refetchReservations,
  } = useQuery(['reservations'], fetchReservations);

  const {
    data: feedbackData,
    error: feedbackError,
    isLoading: feedbackLoading,
    refetch: refetchFeedback,
  } = useQuery('feedback', fetchFeedback);

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery('users', fetchUsers);

  useEffect(() => {
    if (isModalVisible) {
      refetchReservations();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isFeedbackModalVisible) {
      refetchFeedback();
    }
  }, [isFeedbackModalVisible]);

  useEffect(() => {
    if (isUsersModalVisible) {
      refetchUsers();
    }
  }, [isUsersModalVisible]);

  const handleDeleteReservation = async (id: any) => {
    try {
      await axios.delete(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/delete-reservation?id=${id}`);
      refetchReservations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolveFeedback = async (id: any) => {
    try {
      await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/resolve?id=${id}`);
      refetchFeedback();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    setLoading(true);
    setIsImageModalVisible(true);
  };

  const styles = theme === 'light' ? lightTheme : darkTheme;

  const renderReservationItem = ({ item }: { item: any }) => (
    <View style={styles.reservationItem}>
      <View style={styles.reservationDetails}>
        <Text style={styles.reservationText}>Username: {item.username}</Text>
        <Text style={styles.reservationText}>Start Time: {item.startTime}</Text>
        <Text style={styles.reservationText}>End Time: {item.endTime}</Text>
        <Text style={styles.reservationText}>Priority: {item.priority}</Text>
      </View>
      <Pressable onPress={() => handleDeleteReservation(item._id)} style={styles.trashIcon}>
        <Ionicons name="trash" size={24} color="red" />
      </Pressable>
    </View>
  );

  const renderFeedbackItem = ({ item }: { item: any }) => (
    <View style={styles.feedbackItem}>
      {item.image && (
        <Pressable onPress={() => handleImageSelect(`${item.image}`)}>
          <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/problems/${item.image}` }} style={styles.feedbackImage} />
        </Pressable>
      )}
      <View style={styles.feedbackContent}>
        <Text style={styles.feedbackUser}>{item.user}</Text>
        <Text style={styles.feedbackText}>{item.feedback}</Text>
        <Text style={styles.feedbackTime}>{new Date(item.timeNow).toLocaleString()}</Text>
      </View>
      <Pressable onPress={() => handleResolveFeedback(item._id)} style={styles.resolveIcon}>
        <Ionicons name="checkmark-circle" size={24} color="green" />
      </Pressable>

      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        onRequestClose={() => setIsImageModalVisible(false)}
        transparent={true}
      >
        <Pressable style={styles.imageModalOverlay} onPress={() => setIsImageModalVisible(false)}>
          <View style={styles.imageModalContent}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={styles.loadingText}>Loading image...</Text>
              </View>
            )}
            <Image
              source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/problems/${selectedImage}` }}
              style={styles.fullSizeImage}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }} style={styles.userAvatar} />
      <View style={styles.userDetails}>
        <Text style={styles.listText}>{item._name}</Text>
        <Text style={styles.listText}>{item._email}</Text>
        <Text style={styles.listText}>{item._licensePlate}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeader}>Admin Dashboard</Text>
      <Pressable style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>View Reservations</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setIsFeedbackModalVisible(true)}>
        <Text style={styles.buttonText}>View Problems</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setIsUsersModalVisible(true)}>
        <Text style={styles.buttonText}>View Users</Text>
      </Pressable>

      {/* Reservations Modal */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Current Reservations</Text>
              <Pressable onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            {reservationsLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : reservationsError ? (
              <Text style={styles.errorText}>Error: {(reservationsError as Error).message}</Text>
            ) : (
              <FlatList
                data={reservations}
                renderItem={renderReservationItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.reservationList}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={isFeedbackModalVisible}
        onRequestClose={() => setIsFeedbackModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Problems</Text>
              <Pressable onPress={() => setIsFeedbackModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            {feedbackLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : feedbackError ? (
              <Text style={styles.errorText}>Error loading feedback</Text>
            ) : (
              <FlatList
                data={feedbackData}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.feedbackList}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Users Modal */}
      <Modal
        visible={isUsersModalVisible}
        onRequestClose={() => setIsUsersModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Users</Text>
              <Pressable onPress={() => setIsUsersModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <TextInput
              placeholder="Search by email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {usersLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : usersError ? (
              <Text style={styles.errorText}>Error loading users</Text>
            ) : (
              <FlatList
                data={usersData.filter((user: { _email: string; }) => user._email.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderUserItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
}