// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3708ZVL8XaCef8IMhZzmpL_c2DUxvwDE",
  authDomain: "projeto-67c45.firebaseapp.com",
  projectId: "projeto-67c45",
  storageBucket: "projeto-67c45.appspot.com",
  messagingSenderId: "302867931252",
  appId: "1:302867931252:web:b51d0838fc555c33cdb121",
  measurementId: "G-4TXMCYML1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializando o Firestore
const db = getFirestore(app);

// Verifica e inicializa o Analytics
isSupported().then((yes) => {
  if (yes) {
    const analytics = getAnalytics(app);
  }
});

export { app, db };
