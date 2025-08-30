importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCOlAjXNXFZwWB7UyrszBkMSYLZMk88y4s",
  authDomain: "bird-alert-system-d8c62.firebaseapp.com",
  projectId: "bird-alert-system-d8c62",
  storageBucket: "bird-alert-system-d8c62.firebasestorage.app",
  messagingSenderId: "308916345226",
  appId: "1:308916345226:web:d7b506ac99f7555110d073",
  measurementId: "G-37H1YJ1NK0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'bird-alert'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});