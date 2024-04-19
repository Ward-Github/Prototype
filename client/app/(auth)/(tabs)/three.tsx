import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';

export default function TabThreeScreen() {
    const [data, setData] = useState([]);
    const auth = useAuth();

    useEffect(() => {
      fetch('http://192.168.178.23:3000/car_list')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
    }, []);
  
    const handleSelect = (value: string) => {
      const body = {
        "userId": auth.user?.id,
        "car": value
      }

      fetch('http://192.168.178.23:3000/changeCar', {
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
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={false}
        extraScrollHeight={50}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
              <View style={styles.rectangle}>
                  <View style={styles.profileContainer}>
                    <Image 
                        source={require('../../../assets/images/avatar.jpg')} 
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{auth.user?.name}</Text>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{auth.user?.email}</Text>
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Car</Text>
                    <SelectList 
                      setSelected={(val: string) => { handleSelect(val); }}
                      data={data} 
                      save="value"
                      placeholder={useAuth().user?.car || "Select a car"}
                      fontFamily='Azonix'
                      arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
                      boxStyles={{backgroundColor: '#2D6AA6', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}
                      inputStyles={{color: '#fff'}}
                      dropdownStyles={{backgroundColor: '#fff'}}
                    />
                  </View>
              </View>
          </View>
      </TouchableWithoutFeedback>
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
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 40,
},
avatar: {
  width: 150,
  height: 150,
  borderRadius: 75,
  alignSelf: 'center',
},
userInfo: {
  marginLeft: 20,
  justifyContent: 'center',
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
  value: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Azonix',
  },
  input: {
      height: 40,
      color: '#fff',
      backgroundColor: '#0F3B5A',
      borderRadius: 5,
      paddingLeft: 10,
  },
});