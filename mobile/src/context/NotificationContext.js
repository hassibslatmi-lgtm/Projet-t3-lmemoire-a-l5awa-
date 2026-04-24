import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Vibration, Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { Colors } from '../theme/colors';
import * as NavigationService from '../navigation/NavigationService'; 
import { api } from '../api'; // Assuming you have an exported axios instance named 'api' or similar to call available missions

const NotificationContext = createContext();
const { width } = Dimensions.get('window');

export const NotificationProvider = ({ children }) => {
  const { userToken } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);
  const [sound, setSound] = useState(null);
  const pollInterval = useRef(null);
  const lastMissionIds = useRef(new Set()); // To track missions we've already alerted about

  useEffect(() => {
    if (userToken) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => {
      stopPolling();
      stopAlarm();
    };
  }, [userToken]);

  const startPolling = () => {
    // Check every 10 seconds for new available missions
    pollInterval.current = setInterval(checkForNewMissions, 10000);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
  };

  const checkForNewMissions = async () => {
    try {
      // Replace this with your actual endpoint for available missions
      const response = await api.get('/api/orders/transporter/available-missions/'); 
      const missions = response.data;

      if (missions && missions.length > 0) {
        // Find if there's a mission we haven't alerted for yet
        const newMission = missions.find(m => !lastMissionIds.current.has(m.id));
        
        if (newMission && !activeAlert) {
          // Add to tracked missions
          lastMissionIds.current.add(newMission.id);
          
          setActiveAlert({
            order_id: newMission.id,
            description: `Mission: From ${newMission.pickup_address} to ${newMission.shipping_address}`,
            amount: newMission.total_amount
          });
          startAlarm();
        }
      }
    } catch (error) {
      console.log('Polling Error:', error?.message);
    }
  };

  const startAlarm = async () => {
    try {
      Vibration.vibrate([1000, 2000, 3000], true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setSound(newSound);
    } catch (error) {
      console.log('Alarm Error:', error);
    }
  };

  const stopAlarm = async () => {
    Vibration.cancel();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const handleDecline = async () => {
    await stopAlarm();
    setActiveAlert(null);
  };

  const handleAccept = async () => {
    await stopAlarm();
    setActiveAlert(null);
    NavigationService.navigate('Requests'); // Navigate to Available Missions
  };

  return (
    <NotificationContext.Provider value={{ activeAlert, stopAlarm }}>
      {children}
      
      <Modal visible={!!activeAlert} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="flash" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>New Mission Available! 🚚</Text>
            <Text style={styles.desc}>{activeAlert?.description}</Text>
            <Text style={styles.price}>{activeAlert?.amount} DZD</Text>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.decline]} onPress={handleDecline}>
                <Text style={styles.declineText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.accept]} onPress={handleAccept}>
                <Text style={styles.acceptText}>View Mission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: width * 0.85, backgroundColor: '#fff', borderRadius: 30, padding: 25, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: -65, borderWidth: 6, borderColor: '#fff' },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginTop: 15 },
  desc: { fontSize: 16, color: '#64748B', textAlign: 'center', marginVertical: 15 },
  price: { fontSize: 24, fontWeight: '900', color: Colors.primary, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  decline: { backgroundColor: '#F1F5F9' },
  accept: { backgroundColor: Colors.primary },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  declineText: { color: '#64748B', fontWeight: 'bold', fontSize: 16 },
});
