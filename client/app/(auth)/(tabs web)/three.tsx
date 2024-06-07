import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';


export default function TabThreeScreen() {
      const { user } = useAuth();
      const [username, setUsername] = useState(user?.name || '');
      const [email, setEmail] = useState(user?.email || '');
      const [licensePlate, setLicensePlate] = useState(user?.licensePlate || '');
      const [pfp, setPfp] = useState(user?.pfp || '');
    
    

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
    };

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
          
          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
        </KeyboardAwareScrollView>
      );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#041B2A',
  },
  rectangle: {
      width: '95%', 
      height: '95%', 
      backgroundColor: '#0F2635', 
      justifyContent: 'flex-start',
      alignItems: 'flex-start', 
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
  },
  inputContainer: {
      marginBottom: 20,
      width: '100%',
  },
  label: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 5,
      fontFamily: 'Azonix',
  },
  input: {
      height: 40,
      color: '#fff',
      backgroundColor: '#0F3B5A',
      borderRadius: 5,
      paddingLeft: 10,
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
});