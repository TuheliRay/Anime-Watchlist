importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

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

// Optional: Handle background messages to customize the notification
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // If you send a "notification" payload, Firebase automatically shows a notification.
  // If you only send a "data" payload, you must construct the notification manually here.

  if (payload.data && !payload.notification) {
    const notificationTitle = payload.data.title || 'New Anime Update';
    const notificationOptions = {
      body: payload.data.body || 'An anime you are tracking has a new episode!',
      icon: '/icons.svg',
      data: payload.data, // This data is accessible when the user clicks the notification
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Define the URL to open when the user clicks the notification
  const clickUrl = event.notification.data?.url || '/';
  const urlToOpen = new URL(clickUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
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
