import React, { useState } from 'react';
import Status from '@/components/Home/Status';
import Feedback from '@/components/Home/Feedback';
import { ScrollView } from 'react-native';
import { lightTheme, darkTheme } from '@/styles/Home/userHomeStyles';
import { useTheme } from '@/context/ThemeProvider';

export default function TabOneScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ScrollView style={styles.container}>
      <Status setModalVisible={setModalVisible} />
      <Feedback isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
}
