import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthProvider';
import { useAdminMode } from '@/context/AdminModeContext';
import { TextInput } from '@/components/Themed';
import CameraComponent from '@/components/CameraComponent';

export default function TabThreeScreen() {
    const auth = useAuth();
    const [data, setData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [licensePlate, setLicensePlate] = useState(auth.user?.licensePlate || '');
    const [licensePlateProfile, setLicensePlateProfile] = useState(auth.user?.licensePlate || '');
    const [loading, setLoading] = useState(false);
    const { isAdminMode, setIsAdminMode } = useAdminMode();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [cameraVisible, setCameraVisible] = useState(false);

    useEffect(() => {
        fetchCarList();
    }, []);

    useEffect(() => {
        if (text) {
            setLicensePlate(text);
        }
    }, [text]);

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
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/changeCar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to change car');
            }

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
                        <Image
                            source={require('../../../assets/images/avatar.jpg')}
                            style={styles.avatar}
                        />
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
                                {cameraVisible ? (
                                    <CameraComponent setImageUri={setImageUri} setText={setText} />
                                ) : (
                                    <Pressable style={styles.changeCarButton} onPress={() => setCameraVisible(true)}>
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.changeCarButtonText}>Scan Plate</Text>
                                        )}
                                    </Pressable>
                                )}
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
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#FF4D4D',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
