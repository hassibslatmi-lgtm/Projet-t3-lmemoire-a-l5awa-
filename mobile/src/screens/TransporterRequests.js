import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { getAvailableMissions, acceptMission } from '../api';
import MissionCard from '../components/MissionCard';

const { width } = Dimensions.get('window');

export default function TransporterRequests() {
  const navigation = useNavigation();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Distance');

  const fetchMissions = async () => {
    try {
      const data = await getAvailableMissions();
      setMissions(data);
    } catch (e) {
      console.error('Fetch missions error:', e);
      Alert.alert('Error', 'Failed to load available missions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMissions();
    setRefreshing(false);
  };

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      await acceptMission(id);
      Alert.alert('Success', 'Mission accepted successfully!', [
        { 
          text: 'Go to My Missions', 
          onPress: () => navigation.navigate('Missions') 
        }
      ]);
      // Immediately navigate as per Web logic
      navigation.navigate('Missions');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to accept mission.');
      fetchMissions();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (id) => {
    Alert.alert(
      'Reject Mission',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setMissions(missions.filter(m => m.id !== id));
          }
        }
      ]
    );
  };

  const FilterChip = ({ title }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        activeFilter === title && styles.activeFilterChip
      ]}
      onPress={() => setActiveFilter(title)}
    >
      <Text style={[
        styles.filterChipText,
        activeFilter === title && styles.activeFilterChipText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search product or location..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip title="Distance" />
          <FilterChip title="Earnings" />
          <FilterChip title="Price" />
          <FilterChip title="More Filters" />
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading available requests...</Text>
        </View>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MissionCard
              mission={item}
              onAccept={() => handleAccept(item.id)}
              onReject={() => handleReject(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={Colors.primary} 
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No available requests at the moment.</Text>
              <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
                <Text style={styles.refreshBtnText}>Refresh List</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  filterSection: {
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  refreshBtn: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  refreshBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
