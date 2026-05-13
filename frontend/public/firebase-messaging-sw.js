importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Firebase config 
const firebaseConfig = {
  apiKey: "AIzaSyBvag9fAtQApc_yDe-g9axs-w4RV8XJJ2w",
  authDomain: "anime-b0a68.firebaseapp.com",
  projectId: "anime-b0a68",
  storageBucket: "anime-b0a68.firebasestorage.app",
  messagingSenderId: "973230194760",
  appId: "1:973230194760:web:4e37e22c32b6600087187d",
  measurementId: "G-07EXQ21G3R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages — since we send data-only messages from the backend,
// this handler will always fire (FCM only auto-displays when a "notification" key exists).
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const data = payload.data || {};
  const notificationTitle = data.title || 'New Anime Update';
  const notificationOptions = {
    body: data.body || 'An anime you are tracking has a new episode!',
    icon: '/icons.svg',
    ...(data.image_url && { image: data.image_url }),
    data: data, // Accessible when the user clicks the notification
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks — navigate to the specific anime if possible
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Use the anime-specific URL from the data payload, or fall back to home
  const clickPath = event.notification.data?.url || '/';
  const urlToOpen = new URL(clickPath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate to the anime
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ('focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
