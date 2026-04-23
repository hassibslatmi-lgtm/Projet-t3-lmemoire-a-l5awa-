import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateLocation } from '../api';

const LOCATION_TASK_NAME = 'background-location-task';

export const initLocationTracking = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.log('Foreground location permission denied');
    return;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.log('Background location permission denied');
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60000, // Update every minute
    distanceInterval: 100, // Or every 100 meters
    foregroundService: {
      notificationTitle: 'AgriGov Tracking',
      notificationBody: 'Updating your location for active deliveries',
    },
  });
};

export const stopLocationTracking = async () => {
  const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;
    try {
      await updateLocation(latitude, longitude);
      console.log('Location updated:', latitude, longitude);
    } catch (e) {
      console.log('Failed to update location in background');
    }
  }
});
