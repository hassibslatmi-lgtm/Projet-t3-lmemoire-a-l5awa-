import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getMissionDetails, markAsDelivered } from '../api';

const { width } = Dimensions.get('window');

export default function TransporterMissionDetails({ route, navigation }) {
  const missionId = route.params?.missionId;
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fee, setFee] = useState('');
  const [currentStep, setCurrentStep] = useState(2); // 1: Placed, 2: On the Way, 3: Delivered

  useEffect(() => {
    const fetchDetails = async () => {
      if (!missionId) {
        Alert.alert('Error', 'No mission ID provided.');
        navigation.goBack();
        return;
      }
      try {
        const data = await getMissionDetails(missionId);
        if (data) {
          setMission(data);
          setFee(data.total_amount?.toString() || '');
        } else {
          throw new Error('Mission data is empty');
        }
      } catch (error) {
        console.error('Fetch details error:', error);
        Alert.alert('Error', 'Failed to load mission details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [missionId]);

  const handleUpdateStatus = async () => {
    if (currentStep === 3) {
      Alert.alert(
        'Mark as Delivered',
        'Are you sure you want to complete this delivery?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Delivered',
            onPress: async () => {
              try {
                setUpdating(true);
                await markAsDelivered(missionId);
                Alert.alert('Success', 'Mission completed successfully!', [
                  { text: 'View History', onPress: () => navigation.navigate('Missions') },
                ]);
              } catch (error) {
                Alert.alert('Error', error.response?.data?.error || 'Failed to update status.');
              } finally {
                setUpdating(false);
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Status Updated', 'Mission status updated to "On the Way".');
    }
  };

  const Step = ({ index, title, completed, active }) => (
    <View style={styles.stepContainer}>
      <View style={[
        styles.stepDot,
        completed && styles.stepDotCompleted,
        active && styles.stepDotActive
      ]}>
        {completed ? (
          <Ionicons name="checkmark" size={16} color="#fff" />
        ) : (
          <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{index}</Text>
        )}
      </View>
      <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!mission) {
    return (
      <View style={styles.centered}>
        <Text>Mission not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={40} color="#CBD5E1" />
            <Text style={styles.mapPlaceholderText}>Live Map Tracking Unavailable</Text>
          </View>
          
          {/* Tracking Card Overlay */}
          <View style={styles.trackingCard}>
            <View style={styles.trackingItem}>
              <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
              <View style={styles.trackingInfo}>
                <Text style={styles.trackingLabel}>Speed</Text>
                <Text style={styles.trackingValue}>45 km/h</Text>
              </View>
            </View>
            <View style={styles.trackingDivider} />
            <View style={styles.trackingItem}>
              <Ionicons name="navigate-outline" size={20} color={Colors.primary} />
              <View style={styles.trackingInfo}>
                <Text style={styles.trackingLabel}>Remaining</Text>
                <Text style={styles.trackingValue}>4.2 km</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Mission Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Order #{mission?.id}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{mission?.status?.toUpperCase() || 'ACTIVE'}</Text>
              </View>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routeStep}>
                <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="location" size={20} color="#16A34A" />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Pickup Point</Text>
                  <Text style={styles.routeText}>{mission?.farmer_address || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.routeLine} />

              <View style={styles.routeStep}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="flag" size={20} color="#DC2626" />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Delivery Destination</Text>
                  <Text style={styles.routeText}>{mission?.shipping_address}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stepper Section */}
          <Text style={styles.sectionTitle}>Delivery Progress</Text>
          <View style={styles.stepperCard}>
            <View style={styles.stepperHeader}>
              <Step index={1} title="Placed" completed={currentStep > 1} active={currentStep === 1} />
              <View style={[styles.line, currentStep > 1 && styles.lineCompleted]} />
              <Step index={2} title="On Way" completed={currentStep > 2} active={currentStep === 2} />
              <View style={[styles.line, currentStep > 2 && styles.lineCompleted]} />
              <Step index={3} title="Delivered" completed={currentStep > 3} active={currentStep === 3} />
            </View>

            <View style={styles.stepperActions}>
              <TouchableOpacity 
                style={[styles.statusToggle, currentStep === 2 && styles.statusToggleActive]}
                onPress={() => setCurrentStep(2)}
              >
                <Ionicons 
                  name={currentStep === 2 ? "radio-button-on" : "radio-button-off"} 
                  size={24} 
                  color={currentStep === 2 ? Colors.primary : Colors.outline} 
                />
                <Text style={[styles.statusToggleText, currentStep === 2 && styles.statusToggleTextActive]}>
                  On the Way
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.statusToggle, currentStep === 3 && styles.statusToggleActive]}
                onPress={() => setCurrentStep(3)}
              >
                <Ionicons 
                  name={currentStep === 3 ? "radio-button-on" : "radio-button-off"} 
                  size={24} 
                  color={currentStep === 3 ? Colors.primary : Colors.outline} 
                />
                <Text style={[styles.statusToggleText, currentStep === 3 && styles.statusToggleTextActive]}>
                  Arrived & Delivered
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fee Input */}
          <Text style={styles.sectionTitle}>Financial Details</Text>
          <View style={styles.feeCard}>
            <View style={styles.feeInputWrapper}>
              <View style={styles.currencyBadge}>
                <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
                <Text style={styles.currencyText}>DZD</Text>
              </View>
              <TextInput
                style={styles.feeInput}
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
            <Text style={styles.feeHint}>Agreed Transportation Fee</Text>
          </View>
        </View>
      </ScrollView>

      {/* Main Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.updateButton, updating && styles.disabledButton]} 
          onPress={handleUpdateStatus}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.updateButtonText}>
                {currentStep === 3 ? 'Confirm Delivery' : 'Update Mission Status'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mapContainer: {
    height: 250,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  trackingCard: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  trackingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingInfo: {
    marginLeft: 12,
  },
  trackingLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  trackingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  trackingDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 15,
  },
  content: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  badge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  routeContainer: {
    gap: 0,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  routeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  routeText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#F1F5F9',
    marginLeft: 21,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 25,
    marginBottom: 15,
  },
  stepperCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  stepDotActive: {
    backgroundColor: '#fff',
    borderColor: Colors.primary,
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepNumberActive: {
    color: Colors.primary,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  stepTitleActive: {
    color: Colors.primary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#F1F5F9',
    marginTop: -20,
  },
  lineCompleted: {
    backgroundColor: Colors.primary,
  },
  stepperActions: {
    gap: 12,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusToggleActive: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.primary + '30',
  },
  statusToggleText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  statusToggleTextActive: {
    color: '#1E293B',
  },
  feeCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  feeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 6,
  },
  feeInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  feeHint: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
