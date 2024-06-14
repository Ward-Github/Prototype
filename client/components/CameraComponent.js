import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TextInput, ActivityIndicator, Modal, TouchableOpacity, Pressable, Animated, Image, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';

const { width } = Dimensions.get('window'); // Get the width of the screen

export default function CameraComponent({ setLicensePlateProfile }) {
    const auth = useAuth();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [recognizedPlate, setRecognizedPlate] = useState('');
    const [photoUri, setPhotoUri] = useState('');
    const [scanAnimation] = useState(new Animated.Value(0));

    const takePicture = async () => {
        if (cameraRef) {
            setLoading(true);
            const photo = await cameraRef.takePictureAsync();
            setPhotoUri(photo.uri);
            setModalVisible(false);
            console.log('Photo taken:', photo.uri);
            startScanAnimation();
            await recognizeText(photo.uri);
        }
    };

    const recognizeText = async (uri) => {
        try {
            console.log('Sending image to server...');
            const response = await FileSystem.uploadAsync(
                `http://${process.env.EXPO_PUBLIC_API_URL}:3000/get-licenseplate`,
                uri,
                {
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'image',
                    httpMethod: 'POST',
                });
            console.log('Server response:', response.body);
            setRecognizedPlate(response.body);
            setEditModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch license plate:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Failed to fetch license plate 😢',
                visibilityTime: 3000,
                topOffset: 60,
            });
        } finally {
            setLoading(false);
        }
    };

    const startScanAnimation = () => {
        scanAnimation.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnimation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnimation, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const submitLicensePlate = async () => {
        try {
            const body = {
                userId: auth.user?.id,
                licensePlate: recognizedPlate,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/change-licenseplate`, body, config);

            setLicensePlateProfile(recognizedPlate);
            setEditModalVisible(false);

            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Success',
                text2: 'License plate changed successfully 🎉',
                visibilityTime: 3000,
                topOffset: 60,
            });

        } catch (error) {
            console.error('Failed to submit license plate:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Failed to submit license plate 😢',
                visibilityTime: 3000,
                topOffset: 60,
            });
        }
    };

    const handleFocus = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        if (cameraRef) {
            cameraRef.setFocusDepthAsync(1.0); // Adjust the focus depth as necessary
            console.log('Focus set at:', pageX, pageY);
        }
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.changeCarButton} onPress={() => setModalVisible(true)}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.changeCarButtonText}>Scan License Plate</Text>
                )}
            </Pressable>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.container}>
                    {modalVisible && (
                        <Camera style={styles.camera} type={type} ref={(ref) => setCameraRef(ref)} onPress={handleFocus}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                    <Text style={styles.buttonText}>Take Picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    )}
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={loading && photoUri !== ''}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.scanningContainer}>
                    <Image source={{ uri: photoUri }} style={styles.scannedImage} />
                    <Animated.View style={[styles.scanLine, {
                        transform: [{
                            translateX: scanAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-(width/2), width - (width/2 + 2)],
                            })
                        }]
                    }]} />
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.editModalContainer}>
                    <View style={styles.editModal}>
                        <Text style={styles.modalTitle}>Confirm License Plate</Text>
                        <TextInput
                            style={styles.textInput}
                            value={recognizedPlate}
                            onChangeText={setRecognizedPlate}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={submitLicensePlate}>
                                <Text style={styles.modalButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeCarButton: {
        backgroundColor: '#21304f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    changeCarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    captureButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    closeButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    editModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    editModal: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#21304f',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '45%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    scanningContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    scannedImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
    scanLine: {
        position: 'absolute',
        height: '100%', // Make the line vertical
        width: 2, // Set the width of the line
        backgroundColor: 'red',
    },
});
