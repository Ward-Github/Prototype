import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as FileSystem from 'expo-file-system';


export default function CameraComponent({ setImageUri, setText }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [loading, setLoading] = useState(false);

    const takePicture = async () => {
        if (cameraRef) {
            setLoading(true);
            const photo = await cameraRef.takePictureAsync();
            setImageUri(photo.uri);
            console.log('Photo taken:', photo.uri);
            await recognizeText(photo.uri);
            setLoading(false);
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
            console.log('Server response:', response.data);
            console.log(response)
            console.log(response.data.licensePlate)
            setText(response.data.licensePlate);
        } catch (error) {
            console.error(error);
           console.error('Failed to fetch license plate:', error);
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

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={(ref) => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                    {loading && <ActivityIndicator size="large" color="#fff" />}
                    <Button title="Flip Camera" onPress={toggleCameraType} />
                    <Button title="Take Picture" onPress={takePicture} />
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
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
        margin: 20,
    },
});
