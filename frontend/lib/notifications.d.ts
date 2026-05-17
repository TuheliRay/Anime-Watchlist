export declare function requestNotificationPermission(
  userId: string
): Promise<string | null>;

export declare function setupForegroundMessageListener(): (() => void) | null;
