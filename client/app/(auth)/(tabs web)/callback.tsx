import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

export default function CallbackPage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Logging in...</Text>
    </View>
  );
}