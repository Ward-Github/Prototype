import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

export default function CallbackPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging in...</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#041B2A',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Azonix',
    marginBottom: 10,
  },
});