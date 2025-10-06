/**
 * src/config/apiFirebase.js
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { 
  API_KEY, 
  AUTH_DOMAIN, 
  DATABASE_URL, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN, 
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

const firebase_app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { firebase_app, auth };
