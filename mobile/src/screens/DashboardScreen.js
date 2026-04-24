import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { getTransporterStats } from '../api';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { userInfo } = useAuth();
  const [stats, setStats] = useState({ missions_completed: 0, active_missions: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getTransporterStats();
      setStats(data);
    } catch (e) {
      console.log('Stats fetch error:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back 👋</Text>
          <Text style={styles.userName}>{userInfo?.full_name || 'Transporter'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Active Orders"
              value={stats.active_missions}
              icon={(props) => <Ionicons name="cube-outline" {...props} />}
              color="#3B82F6"
            />
            <StatCard
              title="Completed"
              value={stats.missions_completed}
              icon={(props) => <Ionicons name="checkmark-circle-outline" {...props} />}
              color={Colors.primary}
            />
            <StatCard
              title="On Route"
              value="0"
              icon={(props) => <Ionicons name="location-outline" {...props} />}
              color="#F59E0B"
            />
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Requests')}
          >
            <LinearGradient
              colors={['#E0F2FE', '#F0F9FF']}
              style={styles.actionIcon}
            >
              <Ionicons name="search-outline" size={28} color="#0369A1" />
            </LinearGradient>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Find Missions</Text>
              <Text style={styles.actionDesc}>Browse available delivery jobs</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Missions')}
          >
            <LinearGradient
              colors={['#DCFCE7', '#F0FDF4']}
              style={styles.actionIcon}
            >
              <Ionicons name="time-outline" size={28} color="#166534" />
            </LinearGradient>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Active Tasks</Text>
              <Text style={styles.actionDesc}>Manage your ongoing deliveries</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.outline} />
          </TouchableOpacity>

          <View style={styles.promoCard}>
            <LinearGradient
              colors={[Colors.primary, '#1F3F1B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoGradient}
            >
              <View>
                <Text style={styles.promoTitle}>AgriGov Logistics</Text>
                <Text style={styles.promoDesc}>Sustainable farming through{'\n'}efficient transportation.</Text>
              </View>
              <Ionicons name="leaf-outline" size={40} color="rgba(255,255,255,0.2)" />
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeSection: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.outline,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.onBackground,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onBackground,
    marginBottom: 16,
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    width: (width - 60) / 3,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  statTitle: {
    fontSize: 11,
    color: Colors.outline,
    fontWeight: '600',
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  actionDesc: {
    fontSize: 13,
    color: Colors.outline,
    marginTop: 2,
  },
  promoCard: {
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  promoGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
