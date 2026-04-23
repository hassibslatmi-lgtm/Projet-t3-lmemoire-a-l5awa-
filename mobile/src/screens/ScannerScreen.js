import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

export default function ScannerScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Forced delay to allow native bridge to settle
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (hasPermission === null || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Initializing Camera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No camera access granted</Text>
      </View>
    );
  }

  const handleScan = (result) => {
    if (scanned || !result || !result.data) return;
    setScanned(true);
    route.params.onScan(result.data);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        onBarcodeScanned={handleScan}
      />
    </View>
  );
}
