import { v4 as uuid4 } from "uuid";

export const getDeviceId = (): string => {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = uuid4();
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
};