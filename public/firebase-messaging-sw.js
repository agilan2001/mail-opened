importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyDW_dWlZJiegsi4sCELl-byyhnd866RXzA",
    authDomain: "mail-opened.firebaseapp.com",
    projectId: "mail-opened",
    storageBucket: "mail-opened.appspot.com",
    messagingSenderId: "56856215322",
    appId: "1:56856215322:web:b712037d4c254d4f0c36a3",
    measurementId: "G-T51Z8BPC09"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Received background message ', payload);
    var notification = JSON.parse(payload.data.notification);
    const notificationTitle = "Mail-Opened ALERT 📩";
    const notificationOptions = {
        body: notification.body + ": Your Mail is being viewed...",
        icon: "https://mail-opened.web.app/res/icon.png",
        actions: [
            { action: 'b', title: '👍DONE' },
            { action: 'a', title: 'Mail-Opened' }
        ]
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    if (event.action == 'a') {
        clients.openWindow("https://mail-opened.web.app")
        return;
    }
    else if (event.action == 'b') {
        return;
    }
    clients.openWindow("https://mail-opened.web.app");
}, false);

this.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
});