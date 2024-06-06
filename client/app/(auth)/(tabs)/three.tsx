import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback, Keyboard, Pressable, FlatList, Modal, ActivityIndicator, Switch } from 'react-native';
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
import { useTheme } from '@/context/ThemeProvider';
import { lightTheme, darkTheme } from '@/styles/profileStyles';
import CameraComponent from '@/components/CameraComponent';

export default function TabThreeScreen() {
    const auth = useAuth();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const { theme, setTheme } = useTheme();
    const [licensePlate, setLicensePlate] = useState(auth.user?.licensePlate || '');
    const [licensePlateProfile, setLicensePlateProfile] = useState(auth.user?.licensePlate || '');
    const [pfp, setPfp] = useState(auth.user?.pfp || 'avatar.jpg');
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
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

    const toggleTheme = async () => {
        const newTheme = theme == 'light' ? 'dark' : 'light';

        setTheme(newTheme);
        try {
            await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/switch-theme?id=${auth.user?.id}&theme=${newTheme}`);
        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: `An error occurred while switching the theme 😔`,
                visibilityTime: 3000,
            });
        }
    };

    const styles = theme === 'dark' ? darkTheme : lightTheme;

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
                    <View style={styles.themeSwitchContainer}>
                        <Text style={styles.themeSwitchLabel}>Dark mode</Text>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CameraComponent setImageUri={setImageUri} setLicensePlateProfile={setLicensePlateProfile}/>
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