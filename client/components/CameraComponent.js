import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import Tesseract from 'react-native-tesseract-ocr';

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
    // open image to be read, look for license plate format: xx-999-x, x-999-xx. give back text in only that format
    const recognizeText = async (uri) => {
        try {
            const text = await Tesseract.recognize(
                uri,
                'eng',
                {
                    whitelist: null,
                    blacklist: null,
                },
            );
            const licensePlate = text.match(/[A-Z]{2}-\d{3}-[A-Z]{1}/g) || text.match(/[A-Z]{1}-\d{3}-[A-Z]{2}/g);
            if (licensePlate && licensePlate.length > 0) {
                setText(licensePlate[0]);
            }
            else {
                setText('No license plate found');
            }
        }
        catch (e) {
            console.error(e);
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
