import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IP for physical device testing
// Use 10.0.2.2 for Android Emulator
const BASE_URL = 'http://192.168.1.12:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fixImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) {
    return url.replace(/http:\/\/(127\.0\.0\.1|localhost):8000/, BASE_URL);
  }
  if (url.startsWith('http://192.168.1.7')) {
    return url.replace('http://192.168.1.7:8000', BASE_URL);
  }
  return url;
};

// Request interceptor to add the token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/users/login/', { email, password });
  return response.data;
};

export const getAvailableMissions = async () => {
  const response = await api.get('/api/orders/transporter/available-missions/');
  return response.data;
};

export const getTransporterMissions = async () => {
  const response = await api.get('/api/orders/transporter/missions/');
  return response.data;
};

export const getMissionDetails = async (orderId) => {
  const response = await api.get(`/api/orders/transporter/missions/${orderId}/`);
  return response.data;
};

export const acceptMission = async (orderId) => {
  const response = await api.post(`/api/orders/transporter/accept-mission/${orderId}/`);
  return response.data;
};

export const markAsDelivered = async (orderId) => {
  const response = await api.post(`/api/orders/transporter/mark-delivered/${orderId}/`);
  return response.data;
};

export const updateLocation = async (lat, lng) => {
  // This endpoint might need to be created in the backend
  const response = await api.post('/api/orders/transporter/update-location/', { lat, lng });
  return response.data;
};

export const getTransporterStats = async () => {
  const response = await api.get('/api/orders/transporter/stats/');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile/manage/');
  return response.data;
};

export const updateUserProfile = async (formData) => {
  const response = await api.post('/users/profile/manage/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePushToken = async (token) => {
  const response = await api.patch('/users/profile/manage/', { expo_push_token: token });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/api/notifications/');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read/`);
  return response.data;
};

// --- Buyer API Endpoints ---
export const searchProducts = async (query = '') => {
  const response = await api.get(`/api/products/search/?q=${query}`);
  return response.data;
};

export const getBuyerOrders = async () => {
  const response = await api.get('/api/orders/buyer/orders/');
  return response.data;
};

export const placeOrder = async (orderData) => {
  const response = await api.post('/api/orders/place/', orderData);
  return response.data;
};

export default api;
