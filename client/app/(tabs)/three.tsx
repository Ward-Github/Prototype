import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'

export default function TabThreeScreen() {
    const [username, setUsername] = React.useState("Mark Broekhoven");
    const [email, setEmail] = React.useState("Mark.Broekhoven@gmail.com");
    const [car, setCar] = React.useState("Tesla Model Y");
    const [selected, setSelected] = React.useState("");
    const [data, setData] = useState([]);

    const [isChanged, setIsChanged] = useState(false);
    const [isSaved, setIsSaved] = useState(true);

    const handleSave = () => {
      setIsChanged(false);
      setIsSaved(true);
    };
  
    const handleChange = () => {
      setIsChanged(true);
      setIsSaved(false);
    };

    useEffect(() => {
      fetch('http://192.168.178.23:3000/car_list')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
    }, []);

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
                  <Image 
                      source={require('../../assets/images/avatar.jpg')} 
                      style={styles.avatar}
                  />
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput 
                        style={styles.input} 
                        value={username} 
                        onChangeText={(text) => {
                          setUsername(text);
                          handleChange();
                        }}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input} 
                        value={email} 
                        onChangeText={(text) => {
                          setEmail(text);
                          handleChange();
                        }}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Car</Text>
                    <SelectList 
                      setSelected={(val: React.SetStateAction<string>) => {setSelected(val), handleChange()}}
                      data={data} 
                      save="value"
                      placeholder="SELECT CAR"
                      fontFamily='Azonix'
                      arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
                      boxStyles={{backgroundColor: '#2D6AA6', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}
                      inputStyles={{color: '#fff'}}
                      dropdownStyles={{backgroundColor: '#fff'}}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (isChanged) {
                        handleSave();
                        Toast.show({
                          type: 'success',
                          position: 'top',
                          text1: 'Success',
                          text2: 'Changes have been saved successfully 🎉',
                          visibilityTime: 3000,
                          topOffset: 60,
                        });
                      } else {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          text1: 'Fail',
                          text2: 'No changes to save 😔',
                          visibilityTime: 3000,
                          topOffset: 60,
                        });
                      }
                    }}
                    style={{
                      backgroundColor: isChanged && !isSaved ? '#007AFF' : '#8E8E93',
                      padding: 18,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{color: '#FFFFFF', fontFamily: 'Azonix'}}>Save Changes</Text>
                  </TouchableOpacity>
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
  avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignSelf: 'center',
      marginBottom: 40,
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
});