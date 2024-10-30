// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAwCn9by4w9jgA_l8k7xwP5sk9d1vZYReo",
    authDomain: "shelfmate-41623.firebaseapp.com",
    projectId: "shelfmate-41623",
    storageBucket: "shelfmate-41623.appspot.com",
    messagingSenderId: "811766341779",
    appId: "1:811766341779:web:303e420cbadd4567aa6d66",
    measurementId: "G-BLT486PG5B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, messaging };
