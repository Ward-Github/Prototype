import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, Image, TextInput } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchReservations = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reservations`);
  return response.data.reverse();
};

const fetchFeedback = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/feedback`);
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

  const renderReservationItem = ({ item }: { item: any }) => (
    <View style={styles.reservationItem}>
      <Text style={styles.reservationText}>Username: {item.username}</Text>
      <Text style={styles.reservationText}>Start Time: {item.startTime}</Text>
      <Text style={styles.reservationText}>End Time: {item.endTime}</Text>
      <Text style={styles.reservationText}>Priority: {item.priority}</Text>
    </View>
  );

  const renderFeedbackItem = ({ item }: { item: any }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackUser}>{item.user}</Text>
      <Text style={styles.feedbackText}>{item.feedback}</Text>
      <Text style={styles.feedbackTime}>{new Date(item.timeNow).toLocaleString()}</Text>
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
    </View>
  );
}

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
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#21304f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: '#21304f',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#21304f',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  reservationList: {
    paddingHorizontal: 20,
  },
  reservationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  reservationText: {
    fontSize: 16,
    color: '#333',
  },
  feedbackList: {
    paddingHorizontal: 20,
  },
  feedbackItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  feedbackUser: {
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
  },
  feedbackTime: {
    fontSize: 12,
    color: '#999',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    fontSize: 16,
    color: '#333',
  },
  userDetails: {
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    fontSize: 16,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#A9A9A9',
  }
  
});
