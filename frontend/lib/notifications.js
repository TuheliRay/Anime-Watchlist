import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log("Notification permission granted.");
            //if permission granted , generate token
            const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
            const currentToken = await getToken(messaging, { vapidKey });

            if (currentToken) {
                console.log("FCM Token:", currentToken);
                //Send this token to your backend/database to save it
                return currentToken;
            } else {
                console.log("No registration token available. Request permission to generate one.");
            }
        } else {
            console.warn("Notification permission denied.");
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
    }
    return null;
};
