importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyAvs9lHvMqSd3DE3Sd0iYaJ4C-CMJMyHBs",
  authDomain: "papalina-reservations-ab389.firebaseapp.com",
  projectId: "papalina-reservations-ab389",
  storageBucket: "papalina-reservations-ab389.firebasestorage.app",
  messagingSenderId: "666787905741",
  appId: "1:666787905741:web:18a2f616dbeb0e730d2984"
});

const messaging = firebase.messaging();