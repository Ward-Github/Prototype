import React, { useState, useRef } from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'

export default function TabOneScreen() {
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: '1', value: '08:00 - 09:00' },
    { key: '2', value: '09:00 - 10:00' },
    { key: '3', value: '10:00 - 11:00' },
    { key: '4', value: '11:00 - 12:00' },
    { key: '5', value: '12:00 - 13:00', disabled: true },
    { key: '6', value: '13:00 - 14:00', disabled: true },
    { key: '7', value: '14:00 - 15:00' },
    { key: '8', value: '15:00 - 16:00' },
    { key: '9', value: '16:00 - 17:00' },
    { key: '10', value: '17:00 - 18:00' },
    { key: '11', value: '18:00 - 19:00', disabled: true },
    { key: '12', value: '19:00 - 20:00' },
    { key: '13', value: '20:00 - 21:00' },
    { key: '14', value: '21:00 - 22:00' },
  ]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftRectangle}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>LOADING STATIONS</Text>
      </View>
      <View style={styles.rightRectangle}>
        <View style={styles.columnContainer}>
          <View style={styles.flexBoxesRight}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>FAST RESERVATION</Text>
            <View style={{flex: 1, flexGrow: 0}}>
              <SelectList
                setSelected={(val: React.SetStateAction<string>) => setSelected(val)}
                data={data}
                save="value"
                placeholder="TIME"
                fontFamily='Azonix'
                search={false}
                arrowicon={<MaterialCommunityIcons name="chevron-down" size={30} color="#E1E1E1" />}
                boxStyles={{ backgroundColor: '#46B7FF', borderColor: 'transparent', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexShrink: 1 }}
                inputStyles={{ color: '#fff' }}
                dropdownStyles={{ backgroundColor: '#fff' }}
              />
            </View>
          </View>
          <View style={[styles.flexBoxesRight, { alignItems: 'center' }]}>
            <Text style={styles.titleText} >TESLA MODEL Y</Text>
            <Image source={require('../../../assets/images/image.png')} style={styles.image} />
            <View style={styles.line} />

            <View style={styles.stationContainer}>
              <MaterialCommunityIcons name="ev-station" size={40} color="#E1E1E1" style={styles.modalIcon} />
              <Text style={styles.text} numberOfLines={1} ellipsizeMode='clip'> STATION 8</Text>
            </View>

            <View style={styles.batteryContainer}>
              <MaterialCommunityIcons name="battery-charging" size={40} color="green" style={styles.modalIcon} />
              <Text style={styles.text} numberOfLines={1} ellipsizeMode='clip'> 46%</Text>
            </View>
          </View>

          <View style={styles.flexBoxesRight}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>RESERVATION DETAILS</Text>
          </View>
          <View style={styles.flexBoxesRight}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>TIME SLOT</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#041B2A',
    justifyContent: 'space-evenly',
    flexBasis: '100%',
    padding: 5,
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  leftRectangle: {
    flex: 1,
    flexBasis: '50%',
    backgroundColor: '#0F2635',
    marginBottom: 30,
    marginRight: 15,
    marginTop: 30,
    marginLeft: 30,
    padding: 30,
    borderRadius: 20,
  },
  rightRectangle: {
    flex: 1,
    flexBasis: '50%',
    marginBottom: 30,
    marginRight: 30,
    marginTop: 30,
    marginLeft: 15,
    borderRadius: 20,
    overflow: 'visible',
  },
  columnContainer: {
    flex: 1,
    flexBasis: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 10,
    flexGrow: 1,
  },
  flexBoxesRight: {
    backgroundColor: '#0F2635',
    borderRadius: 20,
    flex: 1,
    padding: 30,
    minHeight: '45%',
    minWidth: '49%',
    maxWidth: '49%',
    maxHeight: '50%',
    overflow: 'scroll',
  },
  line: {
    height: 1,
    backgroundColor: '#E1E1E1',
    width: '90%',
    marginBottom: 20,
    
  },
  titleText: {
    
    fontSize: 32,
    color: '#E1E1E1',
    marginBottom: 20,
    fontFamily: 'Azonix',
    textAlign: 'center',
    
    
  },
  subtitleText: {
   
    flexWrap: 'nowrap',
    fontSize: 24,
    color: '#E1E1E1',
    fontFamily: 'Azonix',
    
  },
  text: {
  
    fontSize: 28,
    color: '#E1E1E1',
    fontFamily: 'Azonix',

  },
  image: {

    width: "75%",
    height: "40%",
    marginTop: 20,
    marginBottom: 20,
    minHeight: "35%",
    minWidth: "35%",
  },
  stationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    minHeight: "5%",
    minWidth: "5%",
  },
});
