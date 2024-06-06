import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Pressable, Dimensions, ScrollView, Animated } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';

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

const HallOfShameAndFame = ({ isModalVisible, setModalVisible }: { isModalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { data: hallOfShameData, isLoading: isLoadingHallOfShame, refetch: refetchHallOfShame } = useQuery('hallOfShame', fetchHallOfShame);
  const { data: hallOfFameData, isLoading: isLoadingHallOfFame, refetch: refetchHallOfFame } = useQuery('hallOfFame', fetchHallOfFame);

  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    if (isModalVisible) {
      refetchHallOfShame();
      refetchHallOfFame();
    }
  }, [isModalVisible]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffset / Dimensions.get('window').width);
    setCurrentPage(pageIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>The hall of shame 🤡</Text>
        <Text style={styles.barelyReadableText}>(make fun of this person)</Text>
        {isLoadingHallOfShame ? (
          <ActivityIndicator size="large" color="#21304f" />
        ) : hallOfShameData && hallOfShameData.length > 0 ? (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[1]._pfp}` }} style={[styles.imageSmall, styles.silverBorder]} />
              <Text style={styles.itemText}>#{2} {hallOfShameData[1]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[0]._pfp}` }} style={[styles.imageLarge, styles.goldBorder]} />
              <Text style={styles.itemText}>#{1} {hallOfShameData[0]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[2]._pfp}` }} style={[styles.imageSmall, styles.bronzeBorder]} />
              <Text style={styles.itemText}>#{3} {hallOfShameData[2]._name.split(' ')[0]}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noItemText}>No one to shame yet.</Text>
        )}
      </View>
      <View style={styles.line} />
      <View style={styles.section}>
        <Text style={styles.title}>The hall of fame 👑</Text>
        {isLoadingHallOfFame ? (
          <ActivityIndicator size="large" color="#21304f" />
        ) : hallOfFameData && hallOfFameData.length > 0 ? (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[1]._pfp}` }} style={[styles.imageSmall, styles.silverBorder]} />
              <Text style={styles.itemText}>#{2} {hallOfFameData[1]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[0]._pfp}` }} style={[styles.imageLarge, styles.goldBorder]} />
              <Text style={styles.itemText}>#{1} {hallOfFameData[0]._name.split(' ')[0]}</Text>
            </View>
            <View style={styles.item}>
              <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[2]._pfp}` }} style={[styles.imageSmall, styles.bronzeBorder]} />
              <Text style={styles.itemText}>#{3} {hallOfFameData[2]._name.split(' ')[0]}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noItemText}>No one to celebrate yet.</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View full hall</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentPage === 0 ? 'Hall of Shame' : 'Hall of Fame'}</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <View style={styles.indicatorContainer}>
              <View style={[styles.indicator, currentPage === 0 ? styles.indicatorActive : null]} />
              <View style={[styles.indicator, currentPage === 1 ? styles.indicatorActive : null]} />
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleScrollEnd}
            >
              <View style={styles.fullList}>
                <FlatList
                  data={hallOfShameData}
                  renderItem={({ item, index }) => (
                    <View style={styles.fullItem}>
                      <Image
                        source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }}
                        style={[
                          styles.fullImage,
                          index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder
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
              <View style={styles.fullList}>
                <FlatList
                  data={hallOfFameData}
                  renderItem={({ item, index }) => (
                    <View style={styles.fullItem}>
                      <Image
                        source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }}
                        style={[
                          styles.fullImage,
                          index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  section: {
    marginBottom: 5,
  },
  line: {
    borderBottomColor: '#21304f',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
  },
  barelyReadableText: {
    fontSize: 10,
    color: '#21304f',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  item: {
    alignItems: 'center',
  },
  imageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  imageSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
  },
  goldBorder: {
    borderColor: '#FFD700',
  },
  silverBorder: {
    borderColor: '#C0C0C0',
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
  },
  itemText: {
    marginTop: 5,
    fontSize: 16,
    color: '#21304f',
  },
  viewButton: {
    padding: 10,
    backgroundColor: '#21304f',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noItemText: {
    fontSize: 16,
    color: '#21304f',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#21304f',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#21304f',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C0C0C0',
    marginHorizontal: 5,
  },
  indicatorActive: {
    backgroundColor: '#21304f',
  },
  scrollViewContent: {
    flex: 1,
  },
  fullList: {
    width: Dimensions.get('window').width,
    padding: 20,
  },
  listTitle: {
    fontSize: 24,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  fullContainer: {
    width: '100%',
    padding: 20,
  },
  fullItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  fullImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 3,
  },
  fullItemText: {
    fontSize: 16,
    color: '#21304f',
  },
});

export default HallOfShameAndFame;
