import React, { useEffect, useState, } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Pressable, Dimensions } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useTheme } from '@/context/ThemeProvider';
import { darkTheme, lightTheme } from '@/webstyles/hallStyles';

const fetchHallOfShame = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/hall-of-shame`);
  console.log(response.data);
  return response.data;
};

const fetchHallOfFame = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/hall-of-fame`);
  console.log(response.data);
  return response.data;
};

const HallOfShameAndFame = ({ isHallOfFameVisible, setHallOfFameVisible }: { isHallOfFameVisible: boolean, setHallOfFameVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { data: hallOfShameData, isLoading: isLoadingHallOfShame, refetch: refetchHallOfShame } = useQuery('hallOfShame', fetchHallOfShame);
  const { data: hallOfFameData, isLoading: isLoadingHallOfFame, refetch: refetchHallOfFame } = useQuery('hallOfFame', fetchHallOfFame);

  const { theme, setTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    if (isHallOfFameVisible) {
      refetchHallOfShame();
      refetchHallOfFame();
    }
  }, [isHallOfFameVisible]);

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <View style={{ flex: 1, minHeight: "45%" }}>
        <Text style={styles.title}>The hall of shame 🤡</Text>
        <Text style={styles.barelyReadableText}>(make fun of this person)</Text>
        {isLoadingHallOfShame ? (
          <ActivityIndicator size="large" color="#21304f" />
        ) : hallOfShameData && hallOfShameData.length > 0 ? (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[1]._pfp}`,
                }}
                style={[styles.imageSmall, styles.silverBorder]}
              />
              <Text style={styles.itemText}>
                #{2} {hallOfShameData[1]._name.split(" ")[0]}
              </Text>
            </View>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[0]._pfp}`,
                }}
                style={[styles.imageLarge, styles.goldBorder]}
              />
              <Text style={styles.itemText}>
                #{1} {hallOfShameData[0]._name.split(" ")[0]}
              </Text>
            </View>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[2]._pfp}`,
                }}
                style={[styles.imageSmall, styles.bronzeBorder]}
              />
              <Text style={styles.itemText}>
                #{3} {hallOfShameData[2]._name.split(" ")[0]}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noItemText}>No one to shame yet.</Text>
        )}
      </View>
      <View style={styles.line} />
      <View style={{ flex: 1, minHeight: "45%" }}>
        <Text style={styles.title}>The hall of fame 👑</Text>
        {isLoadingHallOfFame ? (
          <ActivityIndicator size="large" color="#21304f" />
        ) : hallOfFameData && hallOfFameData.length > 0 ? (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[1]._pfp}`,
                }}
                style={[styles.imageSmall, styles.silverBorder]}
              />
              <Text style={styles.itemText}>
                #{2} {hallOfFameData[1]._name.split(" ")[0]}
              </Text>
            </View>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[0]._pfp}`,
                }}
                style={[styles.imageLarge, styles.goldBorder]}
              />
              <Text style={styles.itemText}>
                #{1} {hallOfFameData[0]._name.split(" ")[0]}
              </Text>
            </View>
            <View style={styles.item}>
              <Image
                source={{
                  uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[2]._pfp}`,
                }}
                style={[styles.imageSmall, styles.bronzeBorder]}
              />
              <Text style={styles.itemText}>
                #{3} {hallOfFameData[2]._name.split(" ")[0]}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noItemText}>No one to celebrate yet.</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => setHallOfFameVisible(true)}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>View full hall</Text>
      </TouchableOpacity>
      <Modal
        visible={isHallOfFameVisible}
        onRequestClose={() => setHallOfFameVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentIndex === 0 ? "Hall of Shame 🤡" : "Hall of Fame 👑"}
              </Text>
              <Pressable
                onPress={() => setHallOfFameVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <Swiper
              showsPagination={true}
              loop={false}
              onIndexChanged={(index) => setCurrentIndex(index)}
              showsButtons={true}
              scrollEnabled={false
              
              }
            >
              <View>
                <FlatList
                  data={hallOfShameData}
                  renderItem={({ item, index }) => (
                    <View style={styles.fullItem}>
                      <Image
                        source={{
                          uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}`,
                        }}
                        style={[
                          styles.fullImage,
                          index === 0
                            ? styles.goldBorder
                            : index === 1
                            ? styles.silverBorder
                            : index === 2
                            ? styles.bronzeBorder
                            : null,
                        ]}
                      />
                      <Text style={styles.fullItemText}>
                        #{index + 1} - {item._name} | {item._shame}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.fullContainer}
                />
              </View>
              <View>
                <FlatList
                  data={hallOfFameData}
                  renderItem={({ item, index }) => (
                    <View style={styles.fullItem}>
                      <Image
                        source={{
                          uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}`,
                        }}
                        style={[
                          styles.fullImage,
                          index === 0
                            ? styles.goldBorder
                            : index === 1
                            ? styles.silverBorder
                            : index === 2
                            ? styles.bronzeBorder
                            : null,
                        ]}
                      />
                      <Text style={styles.fullItemText}>
                        #{index + 1} - {item._name} | {item._fame}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.fullContainer}
                />
              </View>
            </Swiper>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HallOfShameAndFame;
