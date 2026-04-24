import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen'; // Transporter Dashboard
import TransporterRequests from '../screens/TransporterRequests';
import TransporterMissionDetails from '../screens/TransporterMissionDetails';
import TransporterMissions from '../screens/TransporterMissions';
import ProfileScreen from '../screens/ProfileScreen';
import ScannerScreen from '../screens/ScannerScreen';
import NotificationScreen from '../screens/NotificationScreen';

// Buyer Screens
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import ProductDetailsScreen from '../screens/buyer/ProductDetailsScreen';
import CheckoutScreen from '../screens/buyer/CheckoutScreen';
import BuyerOrdersScreen from '../screens/buyer/BuyerOrdersScreen';

import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { navigationRef } from './NavigationService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- TRANSPORTER TABS ---
function TransporterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Missions') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Requests') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View 
                  style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, position: 'absolute', top: -10 }} 
                />
              )}
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 85,
          paddingBottom: 25,
          paddingTop: 15,
          elevation: 0,
        },
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Missions" component={TransporterMissions} options={{ title: 'My Missions' }} />
      <Tab.Screen name="Requests" component={TransporterRequests} options={{ title: 'Available' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- BUYER TABS ---
function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Market') iconName = focused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View 
                  style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, position: 'absolute', top: -10 }} 
                />
              )}
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 85,
          paddingBottom: 25,
          paddingTop: 15,
          elevation: 0,
        },
        headerShown: true,
      })}
    >
      <Tab.Screen name="Market" component={BuyerDashboardScreen} />
      <Tab.Screen name="Orders" component={BuyerOrdersScreen} options={{ title: 'My Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- MAIN NAVIGATOR ---
export default function AppNavigator() {
  const { userToken, userInfo, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            {/* Render Tabs based on Role */}
            {userInfo?.role === 'buyer' ? (
              <Stack.Screen name="Main" component={BuyerTabs} />
            ) : (
              <Stack.Screen name="Main" component={TransporterTabs} />
            )}

            {/* Shared & Transporter Screens */}
            <Stack.Screen name="MissionDetails" component={TransporterMissionDetails} options={{ title: 'Mission Tracking' }} />
            <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: true, title: 'Verify Delivery', headerTransparent: true, headerTintColor: '#fff' }} />
            <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: true, title: 'Notifications' }} />

            {/* Buyer Specific Stack Screens */}
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
