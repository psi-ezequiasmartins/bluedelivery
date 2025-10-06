// src/config/fcm.js
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebase_app } from './apiFirebase';

const messaging = getMessaging(firebase_app);

export function requestFCMPermission() {
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    }
    throw new Error('Permissão de notificação negada');
  });
}

export function listenFCMMessages(callback) {
  onMessage(messaging, callback);
}

export default messaging;
