import { initEpisodeSyncScheduler } from './episodeSyncScheduler.js';
import { initNotificationScheduler } from './notificationScheduler.js';

export const initAllCronJobs = () => {
  console.log('Initializing all cron jobs...');
  
  initEpisodeSyncScheduler();
  initNotificationScheduler();
};