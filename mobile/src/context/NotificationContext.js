import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Vibration, Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { Colors } from '../theme/colors';
import * as NavigationService from '../navigation/NavigationService'; 
import { api, updatePushToken } from '../api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // We handle custom sound manually below
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext();
const { width } = Dimensions.get('window');

export const NotificationProvider = ({ children }) => {
  const { userToken, userInfo } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);
  const [buyerAlert, setBuyerAlert] = useState(null);
  const [sound, setSound] = useState(null);
  const pollInterval = useRef(null);
  const lastMissionIds = useRef(new Set()); 
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (userToken && userInfo) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          updatePushToken(token).catch(err => console.log('Error updating push token:', err));
        }
      });

      if (userInfo.role === 'transporter') {
        startPolling();
      }

      // Setup Expo Push Notification Listeners
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        handleIncomingPush(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (userInfo.role === 'buyer' && data.order_id) {
          NavigationService.navigate('Orders');
        }
      });

    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
      stopAlarm();
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userToken, userInfo]);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: "your-expo-project-id", // Change this to your actual project ID or omit if unneeded
    })).data;
    return token;
  }

  const handleIncomingPush = async (notification) => {
    // If buyer receives a notification (e.g. Delivered)
    if (userInfo?.role === 'buyer') {
      await playPingSound();
      setBuyerAlert({
        title: notification.request.content.title || 'Notification',
        body: notification.request.content.body || 'You have a new update.',
      });
      // Auto hide buyer alert after 4 seconds
      setTimeout(() => setBuyerAlert(null), 4000);
    }
  };

  const playPingSound = async () => {
    try {
      Vibration.vibrate();
      const { sound: pingSound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' }, // Replace with a short ping url if desired, using same for now but no loop
        { shouldPlay: true, volume: 1.0 }
      );
      // Play once
      await pingSound.playAsync();
      // Unload after playing
      setTimeout(() => pingSound.unloadAsync(), 2000);
    } catch (error) {
      console.log('Ping Error:', error);
    }
  };

  const startPolling = () => {
    pollInterval.current = setInterval(checkForNewMissions, 10000);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
  };

  const checkForNewMissions = async () => {
    try {
      const response = await api.get('/api/orders/transporter/available-missions/'); 
      const missions = response.data;

      if (missions && missions.length > 0) {
        const newMission = missions.find(m => !lastMissionIds.current.has(m.id));
        
        if (newMission && !activeAlert) {
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
    NavigationService.navigate('Requests'); 
  };

  return (
    <NotificationContext.Provider value={{ activeAlert, stopAlarm }}>
      {children}
      
      {/* Transporter Alarm Modal */}
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

      {/* Buyer Toast Notification */}
      {buyerAlert && (
        <View style={styles.toastContainer}>
          <View style={styles.toastBox}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>{buyerAlert.title}</Text>
              <Text style={styles.toastBody}>{buyerAlert.body}</Text>
            </View>
          </View>
        </View>
      )}
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
  
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  toastBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#10B981',
  },
  toastTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  toastBody: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
});
