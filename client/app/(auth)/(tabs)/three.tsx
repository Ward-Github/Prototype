import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAuth } from '@/context/AuthProvider';
import { useAdminMode } from '@/context/AdminModeContext';

export default function TabThreeScreen() {
    const [data, setData] = useState([]);
    const { isAdminMode, setIsAdminMode } = useAdminMode();
    const auth = useAuth();

    useEffect(() => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/car_list`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error(error));
    }, []);

    const handleSelect = (value: string) => {
        const body = {
            "userId": auth.user?.id,
            "car": value
        }

        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/changeCar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                if (!response.ok) {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Error',
                        text2: `An error occurred while changing the car 😔`,
                        visibilityTime: 3000,
                    });
                }
                else {
                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Success',
                        text2: 'Car changed successfully 🎉',
                        visibilityTime: 3000,
                        topOffset: 60,
                    });
                }
            })
    };

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={false}
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
                        </View>
                    </View>
                    <View style={styles.carContainer}>
                        <Text style={styles.label}>Car</Text>
                        <SelectList
                            setSelected={(val: string) => { handleSelect(val); }}
                            data={data}
                            save="value"
                            placeholder={auth.user?.car || "Select a car"}
                            fontFamily='Poppins'
                            arrowicon={<MaterialCommunityIcons name="chevron-down" size={24} color="#000" />}
                            boxStyles={styles.selectBox}
                            inputStyles={styles.selectInput}
                            dropdownStyles={styles.dropdown}
                        />
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
    },
    selectInput: {
        color: '#333',
    },
    dropdown: {
        backgroundColor: '#f0f4f8',
        borderColor: '#ddd',
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
