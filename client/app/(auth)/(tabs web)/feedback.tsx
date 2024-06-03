import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

export default function Feedback() {
    const [isReservationsExpanded, setIsReservationsExpanded] = useState(false);
    const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);

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

    useEffect(() => {
        if (isReservationsExpanded) {
            setIsFeedbackExpanded(false);
            refetchReservations();
        }
    }, [isReservationsExpanded]);

    useEffect(() => {
        if (isFeedbackExpanded) {
            setIsReservationsExpanded(false);
            refetchFeedback();
        }
    }, [isFeedbackExpanded]);

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

    return (
        <View style={styles.container}>
            <Text style={styles.profileHeader}>Admin Dashboard</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsReservationsExpanded(!isReservationsExpanded)}
            >
                <Text style={styles.buttonText}>View Reservations</Text>
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
                <Text style={styles.buttonText}>View Feedback</Text>
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
});
