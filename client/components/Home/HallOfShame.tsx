import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Pressable } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';

const fetchHallOfShame = async () => {
  const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/hall-of-shame`);
  console.log(response.data);
  return response.data;
};

const HallOfShame = ({ isHallOfShameVisible, setHallOfShameVisible }: { isHallOfShameVisible: boolean, setHallOfShameVisible: (value: boolean) => void }) => {
  const { data: hallOfShameData, isLoading: isLoadingHallOfShame, refetch: refetchHallOfShame } = useQuery('hallOfShame', fetchHallOfShame);

  useEffect(() => {
    if (isHallOfShameVisible) {
      refetchHallOfShame();
    }
  }, [isHallOfShameVisible]);

  return (
    <View style={styles.shameRectangle}>
      <Text style={styles.shameTitle}>The hall of shame 🤡</Text>
      <Text style={styles.barelyReadableText}>(make fun of this person)</Text>
      {isLoadingHallOfShame ? (
        <ActivityIndicator size="large" color="#21304f" />
      ) : hallOfShameData && hallOfShameData.length > 0 ? (
        <View style={styles.shameContainer}>
          <View style={styles.shameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[1]._pfp}` }} style={[styles.shameImageSmall, styles.silverBorder]} />
            <Text style={styles.shameText}>#{2} {hallOfShameData[1]._name.split(' ')[0]}</Text>
          </View>
          <View style={styles.shameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[0]._pfp}` }} style={[styles.shameImageLarge, styles.goldBorder]} />
            <Text style={styles.shameText}>#{1} {hallOfShameData[0]._name.split(' ')[0]}</Text>
          </View>
          <View style={styles.shameItem}>
            <Image source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${hallOfShameData[2]._pfp}` }} style={[styles.shameImageSmall, styles.bronzeBorder]} />
            <Text style={styles.shameText}>#{3} {hallOfShameData[2]._name.split(' ')[0]}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noShameText}>No one to shame yet.</Text>
      )}
      {hallOfShameData && hallOfShameData.length > 0 && (
        <TouchableOpacity onPress={() => setHallOfShameVisible(true)} style={styles.viewShameButton}>
          <Text style={styles.viewShameButtonText}>View full hall of shame</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={isHallOfShameVisible}
        onRequestClose={() => setHallOfShameVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hall of Shame</Text>
              <Pressable onPress={() => setHallOfShameVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={hallOfShameData}
              renderItem={({ item, index }) => (
                <View style={styles.fullShameItem}>
                  <Image
                    source={{ uri: `http://${process.env.EXPO_PUBLIC_API_URL}:3000/images/${item._pfp}` }}
                    style={[
                      styles.fullShameImage,
                      index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder
                    ]}
                  />
                  <Text style={styles.fullShameText}>
                    #{index + 1} - {item._name} | {item._shame}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.fullShameContainer}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  shameRectangle: {
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
  shameTitle: {
    fontSize: 24,
    color: '#21304f',
    fontFamily: 'Poppins-Bold',
  },
  barelyReadableText: {
    fontSize: 10,
    color: '#21304f',
    marginBottom: 10,
  },
  shameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  shameItem: {
    alignItems: 'center',
  },
  shameImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  shameImageSmall: {
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
  shameText: {
    marginTop: 5,
    fontSize: 16,
    color: '#21304f',
  },
  viewShameButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#21304f',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewShameButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noShameText: {
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
  fullShameContainer: {
    width: '100%',
    padding: 20,
  },
  fullShameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  fullShameImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 3,
  },
  fullShameText: {
    fontSize: 16,
    color: '#21304f',
  },
});

export default HallOfShame;
