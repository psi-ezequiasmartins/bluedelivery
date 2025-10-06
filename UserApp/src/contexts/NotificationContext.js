import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [pushToken, setPushToken] = useState(null);
  const [notify, setNotify] = useState(false);

  async function getPushToken() {
    const storedToken = await AsyncStorage.getItem('vPushToken');
    setPushToken(storedToken);
    return storedToken;
  }

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('vPushToken');
      setPushToken(token);
    })();
  }, []);

  return (
    <NotificationContext.Provider value={{
      pushToken, notify, getPushToken, setNotify
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
