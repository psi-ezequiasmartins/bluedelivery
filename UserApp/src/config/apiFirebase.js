/**
 * src/config/apiFirebase.js
 * Configuração Firebase para React Native usando variáveis .env
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID // Para Google Analytics
};

// Inicializar Firebase App (evita dupla inicialização)
const firebase_app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Inicializar serviços Firebase
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const database = getDatabase(firebase_app); // Para RTDB
const storage = getStorage(firebase_app);   // Para Firebase Storage

// Debug no desenvolvimento
if (__DEV__) {
  console.log('🔥 Firebase inicializado:', {
    projectId: PROJECT_ID,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL
  });
}

export {
  firebase_app,
  auth,
  database,
  storage
};
