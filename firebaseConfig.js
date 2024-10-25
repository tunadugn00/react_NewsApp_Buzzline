import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC2YMqEtEsrntau1LCDrg8Di3NVERk2iFM",
    authDomain: "news-app-80209.firebaseapp.com",
    projectId: "news-app-80209",
    storageBucket: "news-app-80209.appspot.com",
    messagingSenderId: "807321964202",
    appId: "1:807321964202:web:5e9a201cffd08ecc8c4ad3"
};

// Initialize Firebase
let app;
try {
  app = getApp();
} catch (error) {
  app = initializeApp(firebaseConfig);
}

// Initialize Auth with persistence
let auth;
if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export const db = getFirestore(app);

export { app, auth };