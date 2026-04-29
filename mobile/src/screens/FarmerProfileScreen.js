import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getUserProfile, fixImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

export default function FarmerProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: fixImageUrl(profile?.profile_photo_url || profile?.profile_photo) }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.full_name}</Text>
          <Text style={styles.userRole}>Verified Farmer</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Account Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>
          <InfoItem label="Username" value={`@${profile?.username}`} icon="at" />
          <InfoItem label="Email" value={profile?.email} icon="mail-outline" />
          <InfoItem label="Phone" value={profile?.phone || 'Not provided'} icon="call-outline" />
          <InfoItem label="Residential Address" value={profile?.address || 'Not provided'} icon="location-outline" />
        </View>

        {/* Farm Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Farm Details</Text>
          </View>
          <InfoItem label="Farmer Card" value={profile?.farmer?.farmer_card || 'F-8892-XXXX'} icon="card-outline" />
          <InfoItem label="Farm Location" value={profile?.farmer?.farm_location || 'Not set'} icon="map-outline" />
          <InfoItem label="Farm Area" value={`${profile?.farmer?.farm_area || 0} Hectares`} icon="expand-outline" />
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconBox}>
      <Ionicons name={icon} size={20} color="#64748B" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

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
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: 2,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#FFF',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#059669',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 15,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
