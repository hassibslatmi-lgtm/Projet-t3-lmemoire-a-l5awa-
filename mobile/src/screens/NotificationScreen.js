import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getNotifications, markNotificationAsRead } from '../api';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      // Sort by latest first
      setNotifications(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (e) {
      console.error('Fetch notifications error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      await markNotificationAsRead(id);
    } catch (e) {
      console.error('Mark as read error:', e);
      // Rollback
      fetchNotifications();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.is_read && styles.unreadItem
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        <View style={[
          styles.iconCircle, 
          { backgroundColor: !item.is_read ? Colors.primaryContainer : '#F1F5F9' }
        ]}>
          <Ionicons 
            name={item.verb.includes('طلب') || item.verb.includes('مهمة') ? "cube-outline" : "notifications-outline"} 
            size={22} 
            color={!item.is_read ? Colors.primary : '#64748B'} 
          />
        </View>
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.verb,
            !item.is_read && styles.unreadText
          ]}>
            {item.verb}
          </Text>
          <Text style={styles.time}>{item.time_ago || 'Just now'}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'Update regarding your account or mission.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>You have no notifications at the moment.</Text>
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
  listContent: {
    paddingBottom: 30,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  unreadItem: {
    backgroundColor: 'rgba(45, 90, 39, 0.03)',
  },
  iconContainer: {
    marginRight: 15,
    position: 'relative',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verb: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  unreadText: {
    color: Colors.primary,
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
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
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
