import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { animeService } from "../src/services/animeService";
import { getDeviceId } from "../src/utils/deviceID";

const cache_key = (userId) => `fcm_token_${userId}`;

export const requestNotificationPermission = async (userId) => {
    try {
        if (Notification.permission === 'denied') return null;
        if (Notification.permission == "default") {
            const permission = await Notification.requestPermission();
            if (permission === 'denied') {
                alert("Notification permission denied")
                return null;
            }
        }
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const currentToken = await getToken(messaging, { vapidKey });

        if (!currentToken) return null;

        const key = cache_key(userId);
        const cached = localStorage.getItem(key);
        if (cached === currentToken)
            return currentToken;//Send this token to backend/database to save it
        //if token changed
        const deviceId = getDeviceId();
        await animeService.pushNotification(userId, currentToken, deviceId)
        //update local storage
        localStorage.setItem(key, currentToken);
        return currentToken;
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
        return null;
    }
};

export const setupForegroundMessageListener = () => {
    if (!messaging) return null;

    // Listen to messages while the app is in the foreground
    const unsubscribe = onMessage(messaging, (payload) => {
        console.log('[Foreground] Message received:', payload);

        // Data-only messages: payload.data contains title, body, and metadata
        const data = payload.data || {};
        const title = data.title || payload.notification?.title || 'New Notification';
        const body = data.body || payload.notification?.body || '';

        // Show a system notification when in foreground
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/icons.svg',
                ...(data.image_url && { image: data.image_url }),
                data: data, // Pass data so click handler can navigate to the anime
            });

            // Navigate to the specific anime when the foreground notification is clicked
            notification.onclick = () => {
                const targetUrl = data.url || '/';
                window.focus();
                window.location.href = targetUrl;
                notification.close();
            };
        }
    });

    return unsubscribe;
};