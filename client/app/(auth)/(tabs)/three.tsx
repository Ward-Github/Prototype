import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback, Keyboard, Pressable, FlatList, Modal, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthProvider';
import { useAdminMode } from '@/context/AdminModeContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { TextInput } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function TabThreeScreen() {
    const auth = useAuth();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [licensePlate, setLicensePlate] = useState(auth.user?.licensePlate || '');
    const [licensePlateProfile, setLicensePlateProfile] = useState(auth.user?.licensePlate || '');
    const [pfp, setPfp] = useState(auth.user?.pfp || 'avatar.jpg');
    const [loading, setLoading] = useState(false);
    const { isAdminMode, setIsAdminMode } = useAdminMode();

    useEffect(() => {
        fetchCarList();
    }, []);

    const fetchCarList = async () => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/car_list`);
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCarChange = async () => {
        if (!licensePlate) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'License plate cannot be empty',
                visibilityTime: 3000,
            });
            return;
        }

        setLoading(true);
        const body = {
            userId: auth.user?.id,
            licensePlate,
        };

        try {
            await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/change-licenseplate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).catch(error => console.error('Error:', error));;

            setLicensePlateProfile(licensePlate);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Success',
                text2: 'Car changed successfully 🎉',
                visibilityTime: 3000,
                topOffset: 60,
            });
            setShowInput(false);
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: `An error occurred while changing the car 😔`,
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const { data: feedbackData, error: feedbackError, isLoading: feedbackLoading } = useQuery('feedback', async () => {
        const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/feedback`);
        return response.data;
    });

    const pickImage = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });

        if (!pickerResult.canceled) {
            const imageName = await handleImageUpload(pickerResult.assets[0].uri, auth.user?.id);
            setPfp(imageName);
        }
    };

    const handleImageUpload = async (uri: string, id: any): Promise<string> => {
        const response = await FileSystem.uploadAsync(
            `http://${process.env.EXPO_PUBLIC_API_URL}:3000/pfp-update`,
            uri,
            {
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'image',
                httpMethod: 'POST',
                parameters: {
                    id: id
                },
            },
        );
    
        if (!response) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'An error occurred while uploading the image 😔',
                visibilityTime: 3000,
            });
            return '';
        }

        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Success',
            text2: 'Profile picture set successfully 🎉',
            visibilityTime: 3000,
            topOffset: 60,
        });
    
        return response.body;
    };

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ flexGrow: 1 }}
            extraScrollHeight={50}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.profileHeader}>Profile</Text>
                    <View style={styles.profileContainer}>
                        <Pressable onPress={pickImage}>
                            <Image
                                source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${pfp}` }}
                                style={styles.avatar}
                            />
                        </Pressable>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{auth.user?.name}</Text>
                            <Text style={styles.email}>{auth.user?.email}</Text>
                            <Text style={styles.email}>{licensePlateProfile}</Text>
                        </View>
                    </View>
                    <View style={styles.carContainer}>
                        {showInput ? (
                            <>
                                <Text style={styles.label}>License Plate</Text>
                                <TextInput
                                    style={styles.selectBox}
                                    placeholder="Enter license plate"
                                    placeholderTextColor="#666"
                                    autoCapitalize="characters"
                                    onChangeText={text => setLicensePlate(text)}
                                    value={licensePlate}
                                />
                                <Pressable style={styles.changeCarButton} onPress={handleCarChange}>
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.changeCarButtonText}>Change</Text>
                                    )}
                                </Pressable>
                            </>
                        ) : (
                            <Pressable style={styles.changeCarButton} onPress={() => setShowInput(true)}>
                                <Text style={styles.changeCarButtonText}>Change Car</Text>
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {auth.user?.admin && (
                            <Pressable style={styles.button} onPress={() => setIsAdminMode(!isAdminMode)}>
                                <Text style={styles.buttonText}>{isAdminMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}</Text>
                            </Pressable>
                        )}
                        <Pressable style={[styles.button, styles.logoutButton]} onPress={auth.logout}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
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
        marginLeft: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    userInfo: {
        marginLeft: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    carContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    selectBox: {
        backgroundColor: '#f0f4f8',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        color: '#333',
        padding: 10,
    },
    changeCarButton: {
        backgroundColor: '#21304f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    changeCarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    adminContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        backgroundColor: '#21304f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    logoutButton: {
        backgroundColor: '#FF4D4D',
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
        height: '75%',
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
    },
    closeButton: {
        padding: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
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
});
