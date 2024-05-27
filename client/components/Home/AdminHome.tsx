import React, { useState } from 'react';
import { StyleSheet, FlatList, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    state: string | null;
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
      <View style={styles.modalContent}>
        <MaterialCommunityIcons name="ev-station" size={40} color="#E1E1E1" style={styles.modalIcon} />
        <Text style={styles.modalText}>Station ID: {station.id}</Text>
        <MaterialCommunityIcons name="information" size={24} color="#E1E1E1" style={styles.modalIcon} />
        <Text style={styles.modalText}>Status: {station.status}</Text>
        <MaterialCommunityIcons name="map-marker" size={24} color="#E1E1E1" style={styles.modalIcon} />
        <Text style={styles.modalText}>Street: {station.address.streetName}</Text>
        <Text style={styles.modalText}>City: {station.address.city}</Text>
        <Text style={styles.modalText}>State: {station.address.state}</Text>
        <Text style={styles.modalText}>Postcode: {station.address.postcode}</Text>
        <Text style={styles.modalText}>Country: {station.address.country.name}</Text>
        <MaterialCommunityIcons name="flash" size={24} color="#E1E1E1" style={styles.modalIcon} />
        <Text style={styles.modalText}>Max Power: {station.maxPower} kW</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#E1E1E1" />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const AdminHome: React.FC = () => {
  const { data, error, isLoading, refetch, isFetching } = useQuery('stations', fetchStations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleFilter = (status: string | null) => {
    setFilterStatus(status);
  };

  const filteredData = filterStatus
    ? data?.filter((station: Station) => station.status.toLowerCase() === filterStatus.toLowerCase())
    : data;

    if (isLoading || isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>This may take some time...</Text>
          <ActivityIndicator size="large" color="#333" />
        </View>
      );
    }
    

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

  const renderEVSEs = (evses: Array<{ id: string; status: string }>) => (
    evses.map((evse, index) => (
      <Text key={index} style={[styles.evseStatusText, { color: getStatusColor(evse.status) }]}>
        EVSE {evse.id}: {evse.status}
      </Text>
    ))
  );

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity style={styles.stationItem} onPress={() => setSelectedStation(item)}>
      <Text style={styles.stationIdText}>ID: {item.id}</Text>
      {renderEVSEs(item.evses)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.adminContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter(null)}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('available')}>
          <Text style={styles.filterButtonText}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('charging')}>
          <Text style={styles.filterButtonText}>Charging</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('occupied')}>
          <Text style={styles.filterButtonText}>Occupied</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} color="#E1E1E1" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderStation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          visible={!!selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Common Styles
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },

  // Admin Mode Styles
  adminContainer: {
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
  filterButton: {
    padding: 10,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#E1E1E1',
  },
  stationItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  stationIdText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  evseStatusText: {
    fontSize: 14,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  listContentContainer: {
    paddingBottom: 20,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    color: '#333',
    fontSize: 18,
    marginBottom: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#E1E1E1',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#041B2A',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminHome;
