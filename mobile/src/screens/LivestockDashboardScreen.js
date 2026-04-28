import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getAnimals } from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LivestockDashboardScreen({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnimals = async () => {
    try {
      const data = await getAnimals();
      setAnimals(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
    
    // Auto-refresh every 60 seconds for "Live" tracking
    const interval = setInterval(fetchAnimals, 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnimals();
  };

  const renderAnimalItem = ({ item }) => (
    <View style={styles.animalCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.speciesBadge, { backgroundColor: getSpeciesColor(item.species) + '20' }]}>
            <Text style={[styles.speciesText, { color: getSpeciesColor(item.species) }]}>{item.species}</Text>
          </View>
          {item.is_verified && (
            <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginLeft: 5 }} />
          )}
        </View>
        <Text style={styles.internalId}>#{item.internal_id}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.breedRow}>
          <Text style={styles.breedText}>{item.breed}</Text>
          {item.suspicious_movement && (
            <View style={styles.suspiciousBadge}>
              <Ionicons name="warning" size={12} color="#EF4444" />
              <Text style={styles.suspiciousText}>Suspicious Movement</Text>
            </View>
          )}
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color={Colors.outline} />
          <Text style={styles.locationText}>
            {item.region} • {item.latitude && item.longitude 
              ? `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}`
              : 'No GPS Signal'}
          </Text>
        </View>
      </View>
    </View>
  );

  const getSpeciesColor = (species) => {
    switch (species) {
      case 'Cow': return '#3B82F6';
      case 'Sheep': return '#10B981';
      case 'Goat': return '#F59E0B';
      default: return Colors.outline;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Stats */}
      <View style={styles.header}>
        <LinearGradient
          colors={[Colors.primary, '#1F3F1B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsContainer}
        >
          <View>
            <Text style={styles.statsTitle}>Total Livestock</Text>
            <Text style={styles.statsValue}>{animals.length}</Text>
          </View>
          <Ionicons name="stats-chart" size={50} color="rgba(255,255,255,0.2)" />
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Animals</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={animals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAnimalItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="paw-outline" size={80} color="#E2E8F0" />
                <Text style={styles.emptyText}>No animals registered yet.</Text>
                <Text style={styles.emptySubText}>Tap the + button to add one.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterAnimal')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  statsContainer: {
    padding: 25,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  statsTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  statsValue: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onBackground,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 100,
  },
  animalCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speciesBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  speciesText: {
    fontSize: 12,
    fontWeight: '700',
  },
  internalId: {
    fontSize: 14,
    color: Colors.outline,
    fontWeight: '600',
  },
  cardBody: {
    gap: 4,
  },
  breedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breedText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  suspiciousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  suspiciousText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.outline,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onBackground,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.outline,
    marginTop: 8,
  },
});
