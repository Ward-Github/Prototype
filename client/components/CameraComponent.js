import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import MlkitOcr from 'react-native-mlkit-ocr';

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
            await recognizeText(photo.uri);
            setLoading(false);
        }
    };

    // Look for Dutch license plate format: xx-999-x, x-999-xx
    const recognizeText = async (uri) => {
        try {
            console.log(uri)
            const result = await MlkitOcr.detectFromFile(uri);
            const text = result.map(block => block.text).join(' ');
            const regex = /([A-Z]{2}-\d{3}-[A-Z]{1})|([A-Z]{1}-\d{3}-[A-Z]{2})/g;
            const match = text.match(regex);
            if (match) {
                console.log(match[0]);
                setText(match[0]);
                
            } else {
                setText('No license plate found');
            }
            } catch (error) {
                console.error(error);
            }
    };

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
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
