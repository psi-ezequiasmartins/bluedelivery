import { initializeApp } from 'firebase/app';
import { 
  FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_DATABASEURL, FIREBASE_PROJECTID, 
  FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGINGSENDERID, FIREBASE_APPID
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN, 
  databaseURL: FIREBASE_DATABASEURL,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID
};

export const firebase_app = initializeApp(firebaseConfig);
