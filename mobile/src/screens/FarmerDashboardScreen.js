import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { 
  getFarmerStats, 
  getFarmerOrders, 
  getFarmerProducts, 
  getUserProfile,
  fixImageUrl 
} from '../api';
import { LinearGradient } from 'expo-linear-gradient';

export default function FarmerDashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsData, ordersData, productsData, profileData] = await Promise.all([
        getFarmerStats(),
        getFarmerOrders(),
        getFarmerProducts(),
        getUserProfile(),
      ]);
      setStats(statsData);
      setOrders(ordersData || []);
      setProducts(productsData || []);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching farmer dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
    >
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Welcome Banner */}
      <LinearGradient
        colors={[Colors.primary, '#1F3F1B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeCard}
      >
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{profile?.full_name?.split(' ')[0] || 'Farmer'}!</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: fixImageUrl(profile?.profile_photo_url || profile?.profile_photo) }} 
            style={styles.avatar} 
          />
        </View>
      </LinearGradient>

      {/* 2. Stat Cards */}
      <View style={styles.statsGrid}>
        <StatCard 
          icon="cube" 
          label="Total Products" 
          value={stats?.total_products || 0} 
          color="#3B82F6" 
          bgColor="#EFF6FF"
        />
        <StatCard 
          icon="cart" 
          label="Total Orders" 
          value={stats?.total_orders || 0} 
          color="#8B5CF6" 
          bgColor="#F5F3FF"
        />
        <StatCard 
          icon="cash" 
          label="Total Revenue" 
          value={`${stats?.total_revenue || 0} DZD`} 
          color="#10B981" 
          bgColor="#ECFDF5"
        />
      </View>

      {/* 3. Recent Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FarmerProducts')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {products.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Image source={{ uri: fixImageUrl(item.image) }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.itemValue}>{item.quantity} KG</Text>
          </View>
        ))}
      </View>

      {/* 4. Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {orders.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View style={styles.orderIcon}>
              <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Order #{item.id}</Text>
              <Text style={styles.itemSubtitle}>{item.buyer_name}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>{item.total_amount} DZD</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return '#10B981';
    case 'delivered': return '#3B82F6';
    case 'pending': return '#F59E0B';
    default: return '#64748B';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    margin: 20,
    padding: 25,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  nameText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
