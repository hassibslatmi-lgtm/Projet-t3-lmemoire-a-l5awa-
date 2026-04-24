import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}
