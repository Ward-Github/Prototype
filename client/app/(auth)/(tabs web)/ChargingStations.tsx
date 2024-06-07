import React, { useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import axios from 'axios';

type Station = {
  id: string;
  locationId: string;
  reference: string | null;
  status: string;
  coordinates: {
    lng: number;
    lat: number;
  };
  address: {
    streetName: string;
    postcode: string;
    city: string;
    country: {
      code: string;
      name: string;
    };
  };
  maxPower: number;
  evses: Array<{
    id: string;
    emi3Id: string;
    status: string;
    connectors: Array<{
      id: string;
      type: string;
      format: string;
    }>;
  }>;
  connectors: Array<{
    status: string;
    type: string;
    format: string;
  }>;
  visibilityScope: string;
  accountId: string | null;
  externalAccountId: string | null;
  externalParentAccountId: string | null;
};

const fetchStations = async () => {
  const response = await axios.get(
    'https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955&url=/poi/v1/locations'
  );
  return response.data.stationList;
};

type StationDetailModalProps = {
  station: Station;
  visible: boolean;
  onClose: () => void;
};

const StationDetailModal: React.FC<StationDetailModalProps> = ({ station, visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.fullScreenModalView}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#E1E1E1" />
        </TouchableOpacity>
        <View style={styles.modalItem}>
          <MaterialCommunityIcons name="ev-station" size={40} color="#E1E1E1" style={styles.modalIcon} />
          <Text style={styles.modalText}>Station ID: {station.id}</Text>
        </View>
        <View style={styles.modalItem}>
          <MaterialCommunityIcons name="information" size={24} color="#E1E1E1" style={styles.modalIcon} />
          <Text style={styles.modalText}>Status: {station.status}</Text>
        </View>
        <View style={styles.modalItem}>
          <MaterialCommunityIcons name="map-marker" size={24} color="#E1E1E1" style={styles.modalIcon} />
          <Text style={styles.modalText}>Street: {station.address.streetName}</Text>
        </View>
        <Text style={styles.modalText}>City: {station.address.city}</Text>
        <Text style={styles.modalText}>Postcode: {station.address.postcode}</Text>
        <Text style={styles.modalText}>Country: {station.address.country.name}</Text>
        <View style={styles.modalItem}>
          <MaterialCommunityIcons name="flash" size={24} color="#E1E1E1" style={styles.modalIcon} />
          <Text style={styles.modalText}>Max Power: {station.maxPower} kW</Text>
        </View>
      </View>
    </View>
  </Modal>
);

export default function ChargingStation() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { data, isLoading } = useQuery('stations', fetchStations);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleFilter = (status: string | null) => {
    setFilterStatus(status);
  };

  const handleStationPress = (station: Station) => {
    setSelectedStation(station);
    setIsModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'green';
      case 'charging':
        return 'yellow';
      case 'occupied':
        return 'red';
      default:
        return '#E1E1E1';
    }
  };

  const filteredStations = data ? data.filter((station: Station) => {
    if (filterStatus === null) {
      return true;
    } else {
      return station.status === filterStatus;
    }
  }) : [];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => handleFilter(null)}>
          <Text style={styles.topBarText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('available')}>
          <Text style={styles.topBarText}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('charging')}>
          <Text style={styles.topBarText}>Charging</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('occupied')}>
          <Text style={styles.topBarText}>Occupied</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('unknown')}>
          <Text style={styles.topBarText}>Others</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loading}>Loading stations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.stationItem} onPress={() => handleStationPress(item)}>
              <Text style={styles.stationIdText}>Station ID: {item.id}</Text>
              <Text style={[styles.evseStatusText, { color: getStatusColor(item.status) }]}>Status: {item.status}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContentContainer}
          numColumns={3}
        />
      )}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedStation(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBarText: {
    color: '#E1E1E1',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#21304f',
  },
  titleText: {
    fontSize: 32,
    color: '#E1E1E1',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  loading: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f0f4f8',
  },
  stationItem: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  stationIdText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    flex: 1,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  evseStatusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  fullScreenModalView: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    alignSelf: 'center',
    maxHeight: '50%',
  },
  modalText: {
    fontSize: 18,
    color: '#E1E1E1',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#041B2A',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
