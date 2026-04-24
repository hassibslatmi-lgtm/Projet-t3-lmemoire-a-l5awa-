import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function MissionCard({ mission, onAccept, onReject }) {
  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Image 
          source={{ uri: mission.product_image ? `http://192.168.1.6:8000${mission.product_image}` : 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
        />
        
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>Order #{mission.id}</Text>
            {mission.is_urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.title} numberOfLines={1}>{mission.product_name || 'Agricultural Produce'}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {mission.farmer_address || 'Pickup Point'}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="flag" size={16} color="#F59E0B" />
            <Text style={styles.locationText} numberOfLines={1}>
              {mission.shipping_address || 'Delivery Destination'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{mission.distance || '12.5 km'}</Text>
          </View>
          
          <View style={[styles.statItem, { marginLeft: 20 }]}>
            <Text style={styles.label}>Earnings</Text>
            <Text style={styles.value}>{mission.earnings || mission.total_amount || '1,200'} DZD</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  topSection: {
    flexDirection: 'row',
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 15,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  rejectText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
