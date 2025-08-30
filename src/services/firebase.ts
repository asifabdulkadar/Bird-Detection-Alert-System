import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCOlAjXNXFZwWB7UyrszBkMSYLZMk88y4s",
  authDomain: "bird-alert-system-d8c62.firebaseapp.com",
  projectId: "bird-alert-system-d8c62",
  storageBucket: "bird-alert-system-d8c62.firebasestorage.app",
  messagingSenderId: "308916345226",
  appId: "1:308916345226:web:d7b506ac99f7555110d073",
  measurementId: "G-37H1YJ1NK0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signUp = async (email: string, password: string, role: string = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = collection(db, 'users');
    await addDoc(userDocRef, {
      email,
      role,
      createdAt: serverTimestamp(),
      phone: '+918525062274', // Default phone number
      notificationSettings: {
        smsAlerts: true
      }
    });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export default app;