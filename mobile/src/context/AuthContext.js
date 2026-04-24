import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      if (data.role !== 'transporter' && data.role !== 'buyer' && !data.is_staff) {
        throw new Error('Only transporters and buyers can log in to this app.');
      }
      setUserToken(data.token);
      setUserInfo(data);
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      let info = await AsyncStorage.getItem('userInfo');
      if (token) {
        setUserToken(token);
        setUserInfo(JSON.parse(info));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken, userInfo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
