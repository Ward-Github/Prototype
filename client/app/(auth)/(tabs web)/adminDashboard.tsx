import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Animated, Modal, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';



const fetchReservations = async () => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/reservations`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchFeedback = async () => {
    const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/feedback`);
    return response.data;
};

const fetchUsers = async () => {
    const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/users`);
    return response.data;
  };

export default function Feedback() {
    const [isReservationsExpanded, setIsReservationsExpanded] = useState(false);
    const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const rotateReservations = useRef(new Animated.Value(0)).current;
    const rotateFeedback = useRef(new Animated.Value(0)).current;
    const rotateUsers = useRef(new Animated.Value(0)).current;

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
        if (isReservationsExpanded) {
            setIsFeedbackExpanded(false);
            setIsUsersExpanded(false);
            refetchReservations();
        }
    }, [isReservationsExpanded]);

    useEffect(() => {
        if (isFeedbackExpanded) {
            setIsReservationsExpanded(false);
            setIsUsersExpanded(false);
            refetchFeedback();
        }
    }, [isFeedbackExpanded]);

    useEffect(() => {
        if (isUsersExpanded) {
            refetchUsers();
            setIsFeedbackExpanded(false);
            setIsReservationsExpanded(false);
        }
    }, [isUsersExpanded]);

    useEffect(() => {
        Animated.timing(rotateReservations, {
            toValue: isReservationsExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isReservationsExpanded]);

    useEffect(() => {
        Animated.timing(rotateFeedback, {
            toValue: isFeedbackExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isFeedbackExpanded]);

    useEffect(() => {
        Animated.timing(rotateUsers, {
            toValue: isUsersExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isUsersExpanded]);

    const handleDeleteReservation = async (id: any) => {
        try {
          await axios.delete(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/delete-reservation?id=${id}`);
          refetchReservations();
        } catch (error) {
          console.error(error);
        }
      };

    const renderReservationItem = ({ item }: { item: any }) => (
        <View style={styles.reservationItem}>
            <Text style={styles.reservationText}>Username: {item.username}</Text>
            <Text style={styles.reservationText}>Start Time: {item.startTime}</Text>
            <Text style={styles.reservationText}>End Time: {item.endTime}</Text>
            <Text style={styles.reservationText}>Priority: {item.priority}</Text>
            <TouchableOpacity onPress={() => {
                handleDeleteReservation(item._id);
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Success',
                    text2: 'Reservation deleted',
                  });
            }}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

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
          <Pressable onPress={() => {handleResolveFeedback(item._id)
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Success',
                text2: 'Feedback resolved',
              });
          }} style={styles.resolveIcon}>
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
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsReservationsExpanded(!isReservationsExpanded)}
            >
            <View></View>
            <View>
                <Text style={styles.buttonText}>View Reservations</Text>
            </View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: rotateReservations.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <MaterialIcons name={isReservationsExpanded ? "remove" : "add"} size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
            {isReservationsExpanded && (
                <View style={styles.reservationAccordion}>
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
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
            >
                <View></View>
                <View>
                    <Text style={styles.buttonText}>View Feedback</Text>
                </View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: rotateFeedback.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <MaterialIcons name={isFeedbackExpanded ? "remove" : "add"} size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
            {isFeedbackExpanded && (
                <View style={styles.feedbackAccordion}>
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
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsUsersExpanded(!isUsersExpanded)}
            >
                <View></View>
                <View>
                    <Text style={styles.buttonText}>View Users</Text>
                </View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: rotateUsers.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <MaterialIcons name={isUsersExpanded ? "remove" : "add"} size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
            {isUsersExpanded && (
                <View style={styles.feedbackAccordion}>
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
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    reservationAccordion: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        maxHeight: 300,
        overflow: 'hidden',
    },
    feedbackAccordion: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        maxHeight: 300,
        overflow: 'hidden',
    },
    reservationList: {
        paddingHorizontal: 20,
    },
    reservationItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userDetails: {
        flex: 1,
    },
    listText: {
        fontSize: 16,
        color: '#333',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    feedbackImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    feedbackContent: {
        flex: 1,
    },
    resolveIcon: {
        padding: 10,
    },
    imageModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    imageModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    fullSizeImage: {
        width: 300,
        height: 300,
    },
    loadingContainer: {
        alignItems: 'center',
    },



      
});
