import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Pressable } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';

const fetchHallOfFame = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/hall-of-fame`);
  console.log(response.data);
  return response.data;
};

const HallOfFame = ({ isHallOfFameVisible, setHallOfFameVisible }: { isHallOfFameVisible: boolean, setHallOfFameVisible: (value: boolean) => void }) => {
  const { data: hallOfFameData, isLoading: isLoadingHallOfFame, refetch: refetchHallOfFame } = useQuery('hallOfFame', fetchHallOfFame);

  useEffect(() => {
    if (isHallOfFameVisible) {
      refetchHallOfFame();
    }
  }, [isHallOfFameVisible]);

  return (
    <View style={styles.fameRectangle}>
      <Text style={styles.fameTitle}>The hall of fame 👑</Text>
      {isLoadingHallOfFame ? (
        <ActivityIndicator size="large" color="#21304f" />
      ) : hallOfFameData && hallOfFameData.length > 0 ? (
        <View style={styles.fameContainer}>
          <View style={styles.fameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[1]._pfp}` }} style={[styles.fameImageSmall, styles.silverBorder]} />
            <Text style={styles.fameText}>#{2} {hallOfFameData[1]._name.split(' ')[0]}</Text>
          </View>
          <View style={styles.fameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[0]._pfp}` }} style={[styles.fameImageLarge, styles.goldBorder]} />
            <Text style={styles.fameText}>#{1} {hallOfFameData[0]._name.split(' ')[0]}</Text>
          </View>
          <View style={styles.fameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfFameData[2]._pfp}` }} style={[styles.fameImageSmall, styles.bronzeBorder]} />
            <Text style={styles.fameText}>#{3} {hallOfFameData[2]._name.split(' ')[0]}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noFameText}>No one to celebrate yet.</Text>
      )}
      {hallOfFameData && hallOfFameData.length > 0 && (
        <TouchableOpacity onPress={() => setHallOfFameVisible(true)} style={styles.viewFameButton}>
          <Text style={styles.viewFameButtonText}>View full hall of fame</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={isHallOfFameVisible}
        onRequestClose={() => setHallOfFameVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hall of Fame</Text>
              <Pressable onPress={() => setHallOfFameVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={hallOfFameData}
              renderItem={({ item, index }) => (
                <View style={styles.fullFameItem}>
                  <Image
                    source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }}
                    style={[
                      styles.fullFameImage,
                      index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder
                    ]}
                  />
                  <Text style={styles.fullFameText}>
                    #{index + 1} - {item._name} | {item._fame}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.fullFameContainer}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fameRectangle: {
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
  fameTitle: {
    fontSize: 24,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
  },
  barelyReadableText: {
    fontSize: 10,
    color: '#21304f',
    marginBottom: 10,
  },
  fameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  fameItem: {
    alignItems: 'center',
  },
  fameImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  fameImageSmall: {
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
  fameText: {
    marginTop: 5,
    fontSize: 16,
    color: '#21304f',
  },
  viewFameButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#21304f',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewFameButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noFameText: {
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
  fullFameContainer: {
    width: '100%',
    padding: 20,
  },
  fullFameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  fullFameImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 3,
  },
  fullFameText: {
    fontSize: 16,
    color: '#21304f',
  },
});

export default HallOfFame;
