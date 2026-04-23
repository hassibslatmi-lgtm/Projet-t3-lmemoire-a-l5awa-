import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MissionBoardScreen from '../screens/MissionBoardScreen';
import ActiveMissionsScreen from '../screens/ActiveMissionsScreen';
import ScannerScreen from '../screens/ScannerScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'MissionBoard') iconName = 'assignment';
          else if (route.name === 'ActiveMissions') iconName = 'local-shipping';
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.outline,
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { fontWeight: '800', color: Colors.primary },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="MissionBoard" component={MissionBoardScreen} options={{ title: 'Available' }} />
      <Tab.Screen name="ActiveMissions" component={ActiveMissionsScreen} options={{ title: 'My Missions' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="Scanner" 
              component={ScannerScreen} 
              options={{ 
                headerShown: true, 
                title: 'Verify Delivery',
                headerTransparent: true,
                headerTintColor: '#fff'
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
