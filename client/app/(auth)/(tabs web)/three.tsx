import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';
import { lightTheme, darkTheme } from '@/webstyles/threestyles';
import { useTheme } from '@/context/ThemeProvider';


export default function TabThreeScreen() {
      const { user } = useAuth();
      const [username, setUsername] = useState(user?.name || '');
      const [email, setEmail] = useState(user?.email || '');
      const [licensePlate, setLicensePlate] = useState(user?.licensePlate || '');
      const [pfp, setPfp] = useState(user?.pfp || '');
      const { theme, setTheme } = useTheme();

    const handleSave = async () => {
      const respo = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/updateUser?name=${username}&email=${email}&licensePlate=${licensePlate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          licensePlate,
          pfp,
        }),
      });

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Your changes have been saved.',
      });
    };
    
    const toggleTheme = async () => {
      const newTheme = theme == 'light' ? 'dark' : 'light';

      setTheme(newTheme);
      try {
          await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/switch-theme?id=${user?.id}&theme=${newTheme}`);
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
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.rectangle}>
          <View style={styles.inputContainer}>
          <Image
            source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${pfp}` }}
            style={{ width: 150, height: 150, borderRadius: 100, marginBottom: 20, alignSelf: 'center'}}
            onError={(error) => console.error(error)}
          />
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.label}>License Plate</Text>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
          />
          </View>
          
          <Pressable style={styles.button} onPress={
            handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
        </KeyboardAwareScrollView>
      );
}

