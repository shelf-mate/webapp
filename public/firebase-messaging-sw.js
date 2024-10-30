importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAwCn9by4w9jgA_l8k7xwP5sk9d1vZYReo",
    authDomain: "shelfmate-41623.firebaseapp.com",
    projectId: "shelfmate-41623",
    storageBucket: "shelfmate-41623.appspot.com",
    messagingSenderId: "811766341779",
    appId: "1:811766341779:web:303e420cbadd4567aa6d66",
    measurementId: "G-BLT486PG5B"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Empfangene Hintergrundnachricht: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
