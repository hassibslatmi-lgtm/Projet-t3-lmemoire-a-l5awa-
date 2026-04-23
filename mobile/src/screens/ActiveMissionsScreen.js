import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking
} from 'react-native';
import { Colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { getMyMissions, markAsDelivered } from '../api';

export default function ActiveMissionsScreen({ navigation }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMissions = async () => {
    try {
      const data = await getMyMissions();
      // Filter for shipped missions (active ones)
      setMissions(data.filter(m => m.status === 'shipped'));
    } catch (e) {
      console.log('Fetch missions error:', e);
      Alert.alert('Error', 'Failed to load active missions');
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

  const handleVerify = (missionId) => {
    navigation.navigate('Scanner', {
      onScan: (data) => {
        // data should be the order ID or a verification token
        if (data === missionId.toString()) {
          completeMission(missionId);
        } else {
          Alert.alert('Verification Failed', 'QR code does not match this order.');
        }
      }
    });
  };

  const completeMission = async (id) => {
    try {
      await markAsDelivered(id);
      Alert.alert('Success', 'Delivery confirmed successfully!');
      fetchMissions();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to complete delivery');
    }
  };

  const openMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const MissionItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.statusBadge}>IN TRANSIT</Text>
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={() => openMaps(item.shipping_address)}>
          <MaterialIcons name="map" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeStep}>
          <MaterialIcons name="location-on" size={20} color={Colors.primary} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeText}>{item.pickup_address}</Text>
          </View>
        </View>
        
        <View style={styles.routeDivider} />

        <View style={styles.routeStep}>
          <MaterialIcons name="flag" size={20} color={Colors.secondary} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeText}>{item.shipping_address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => handleVerify(item.id)}
        >
          <MaterialIcons name="qr-code-scanner" size={20} color={Colors.onPrimary} />
          <Text style={styles.verifyButtonText}>Verify & Complete</Text>
        </TouchableOpacity>
      </View>
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
            <MaterialIcons name="local-shipping" size={64} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>You have no active deliveries</Text>
            <TouchableOpacity 
              style={styles.browseButton} 
              onPress={() => navigation.navigate('MissionBoard')}
            >
              <Text style={styles.browseButtonText}>Browse Missions</Text>
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  mapButton: {
    padding: 10,
    backgroundColor: Colors.primaryContainer + '40',
    borderRadius: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  verifyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  verifyButtonText: {
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
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  browseButtonText: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
});
