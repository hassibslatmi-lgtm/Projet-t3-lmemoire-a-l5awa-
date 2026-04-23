import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { getAvailableMissions, acceptMission } from '../api';

export default function MissionBoardScreen() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMissions = async () => {
    try {
      const data = await getAvailableMissions();
      setMissions(data);
    } catch (e) {
      console.log('Fetch missions error:', e);
      Alert.alert('Error', 'Failed to load available missions');
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
      await acceptMission(id);
      Alert.alert('Success', 'Mission accepted successfully!');
      fetchMissions();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to accept mission');
    }
  };

  const MissionItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.amount}>{item.total_amount} DZD</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeStep}>
          <MaterialIcons name="location-on" size={20} color={Colors.primary} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeText}>{item.pickup_address}</Text>
          </View>
        </View>
        
        <View style={styles.routeDivider} />

        <View style={styles.routeStep}>
          <MaterialIcons name="flag" size={20} color={Colors.secondary} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>Delivery</Text>
            <Text style={styles.routeText}>{item.shipping_address}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => handleAccept(item.id)}
      >
        <MaterialIcons name="check-circle" size={20} color={Colors.onPrimary} />
        <Text style={styles.acceptButtonText}>Accept Mission</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MissionItem item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment-late" size={64} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>No missions available right now</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  amount: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  routeContainer: {
    backgroundColor: Colors.surfaceVariant + '30',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  routeText: {
    fontSize: 14,
    color: Colors.onSurface,
    marginTop: 2,
  },
  routeDivider: {
    width: 2,
    height: 15,
    backgroundColor: Colors.outlineVariant,
    marginLeft: 9,
    marginVertical: 4,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  acceptButtonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 16,
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  refreshButtonText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
