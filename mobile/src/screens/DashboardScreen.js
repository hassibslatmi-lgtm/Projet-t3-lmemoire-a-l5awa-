import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { getTransporterStats } from '../api';

export default function DashboardScreen({ navigation }) {
  const { userInfo, logout } = useAuth();
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

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userInfo?.full_name || 'Transporter'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Completed" 
            value={stats.missions_completed} 
            icon="check-circle" 
            color={Colors.primary} 
          />
          <StatCard 
            title="Active" 
            value={stats.active_missions} 
            icon="local-shipping" 
            color={Colors.secondary} 
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('MissionBoard')}
        >
          <View style={[styles.actionIcon, { backgroundColor: Colors.primaryContainer }]}>
            <MaterialIcons name="assignment" size={32} color={Colors.onPrimaryContainer} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Available Missions</Text>
            <Text style={styles.actionDesc}>Find new delivery requests in your area</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ActiveMissions')}
        >
          <View style={[styles.actionIcon, { backgroundColor: Colors.tertiaryContainer }]}>
            <MaterialIcons name="navigation" size={32} color={Colors.onTertiaryContainer} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Active Missions</Text>
            <Text style={styles.actionDesc}>Track and manage your current deliveries</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.errorContainer,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  actionDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
});
