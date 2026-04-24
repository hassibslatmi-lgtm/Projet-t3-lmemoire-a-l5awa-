import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { getUserProfile } from '../api';

export default function Header() {
  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data.profile_photo_url) {
          setProfilePic(data.profile_photo_url);
        }
      } catch (error) {
        console.error('Header profile fetch error:', error);
      }
    };

    fetchProfile();
    
    // Refresh header if we navigate back to a screen (optional but good)
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={26} color={Colors.primary} />
          </View>
          <Text style={styles.brandName}>AgriGov</Text>
        </View>
        
        <View style={styles.right}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#1E293B" />
            <View style={styles.dot} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image 
              source={
                profilePic 
                  ? { uri: profilePic } 
                  : { uri: 'https://ui-avatars.com/api/?name=User&background=2D5A27&color=fff' }
              } 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10, // Adjust for non-notch devices if needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 10,
    backgroundColor: '#F0FDF4',
    padding: 6,
    borderRadius: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    marginRight: 18,
    padding: 4,
  },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
