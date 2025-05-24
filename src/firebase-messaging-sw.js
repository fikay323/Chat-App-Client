importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD1izR8l8ZWQGnaRBPTWmgBV0qbadLnzQo",
    authDomain: "chatapppush-fikky.firebaseapp.com",
    projectId: "chatapppush-fikky",
    messagingSenderId: "165836175773",
    appId: "1:165836175773:web:72af1b0ed099ced483d774"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/icons/icon-72x72.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
