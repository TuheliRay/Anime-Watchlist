import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { animeService } from "../src/services/animeService";
import { getDeviceId } from "../src/utils/deviceID";

const cache_key = (userId) => `fcm_token_${userId}`;

export const requestNotificationPermission = async (userId) => {
    try {
        if (Notification.permission == "default") {
            const permission = await Notification.requestPermission();
            if (permission === 'denied') {
                alert("Notification permission denied")
                return null;
            }
        }
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const currentToken = await getToken(messaging, { vapidKey });

        if(!currentToken) return null;
     
        const key = cache_key(userId);
        const cached = localStorage.getItem(key);
        if(cached === currentToken)
            return currentToken;//Send this token to backend/database to save it
        //if token changed
        const deviceId = getDeviceId();
        await animeService.pushNotification(userId, currentToken, deviceId)
        //update local storage
        localStorage.setItem(key, currentToken);
        return currentToken;
    } catch(error) {
        console.error("An error occurred while retrieving token:", error);
        return null;
    }
};