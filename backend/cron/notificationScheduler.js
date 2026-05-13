import cron from 'node-cron';
import { supabase } from '../utils/supabase.js';
import { sendMulticastNotification, cleanupDeadTokens } from '../utils/messaging.js';

/**
 * Core function to process and send notifications for upcoming anime episodes.
 */
export const processNotifications = async () => {
  console.log('Starting notification processing...');
  try {
    const now = new Date();
    // Calculate timestamp 3 hours from now
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    // 1. Fetch upcoming anime within the next 3 hours
    const { data: upcomingAnime, error: animeError } = await supabase
      .from('anime')
      .select('*')
      .not('next_episode_airing_at', 'is', null)
      .gte('next_episode_airing_at', now.toISOString())
      .lte('next_episode_airing_at', threeHoursFromNow.toISOString());

    if (animeError) {
      console.error('Error fetching upcoming anime:', animeError);
      return;
    }

    if (!upcomingAnime || upcomingAnime.length === 0) {
      console.log('No anime airing in the next 3 hours.');
      return;
    }

    console.log(`Found ${upcomingAnime.length} anime airing within 3 hours.`);

    for (const anime of upcomingAnime) {
      // Use mal_id as the primary identifier if available, otherwise id
      const animeId = anime.mal_id || anime.id; 
      
      // Attempt to extract episode number. If missing, use the airing date to ensure unique weekly notifications!
      let episodeNo = anime.next_episode_number;
      if (!episodeNo) {
         // Fallback to the airing date (YYYY-MM-DD) so weekly episodes aren't skipped
         const airDate = anime.next_episode_airing_at ? new Date(anime.next_episode_airing_at).toISOString().split('T')[0] : 'unknown';
         episodeNo = `Airing ${airDate}`;
      }
      
      // Extract title and image robustly depending on possible schema variations
      const animeTitle = anime.title_english || anime.title_romaji || anime.title || 'Unknown Anime';
      const animeImage = anime.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null;

      // 2. Find users who have notify_enabled = true for this anime
      const { data: userAnimeData, error: userAnimeError } = await supabase
        .from('user_anime')
        .select('user_id')
        .eq('anime_id', animeId)
        .eq('notify_enabled', true);

      if (userAnimeError) {
        console.error(`Error fetching subscribed users for anime ${animeId}:`, userAnimeError);
        continue; // Continue to next anime instead of halting entire process
      }

      if (!userAnimeData || userAnimeData.length === 0) {
        continue; // No users subscribed to this anime
      }

      const userIds = userAnimeData.map(ua => ua.user_id);

      // 3. Prevent duplicate notifications by checking notification_log
      const { data: existingLogs, error: logError } = await supabase
        .from('notification_log')
        .select('user_id')
        .eq('anime_id', animeId)
        .eq('episode_number', String(episodeNo))
        .in('user_id', userIds);

      if (logError) {
        console.error(`Error fetching notification logs for anime ${animeId}:`, logError);
        continue;
      }

      const alreadyNotifiedUserIds = new Set(existingLogs.map(log => log.user_id));
      const usersToNotify = userIds.filter(userId => !alreadyNotifiedUserIds.has(userId));

      if (usersToNotify.length === 0) {
        continue; // All subscribed users already notified for this episode
      }

      // 4. Fetch FCM tokens for the users we need to notify
      // We join across push_subscription to get all registered devices
      const { data: subscriptions, error: subError } = await supabase
        .from('push_subscription')
        .select('user_id, fcm_token')
        .in('user_id', usersToNotify);

      if (subError) {
        console.error(`Error fetching push subscriptions for anime ${animeId}:`, subError);
        continue;
      }

      if (!subscriptions || subscriptions.length === 0) {
        // Log failures for users who enabled notifications but have no valid tokens
        const missingTokenLogs = usersToNotify.map(userId => ({
            user_id: userId,
            anime_id: animeId,
            episode_number: String(episodeNo),
            status: 'failed',
            error_message: 'No push subscription tokens found'
        }));
        
        await supabase.from('notification_log').insert(missingTokenLogs);
        continue;
      }

      const tokens = subscriptions.map(sub => sub.fcm_token);
      
      const payload = {
        title: animeTitle,
        episode_number: String(episodeNo),
        airing_time: anime.next_episode_airing_at,
        image_url: animeImage,
        anime_id: animeId
      };

      console.log(`Sending notifications for anime ${animeId} to ${tokens.length} devices...`);

      // 5. Send Multicast Notification
      const sendResult = await sendMulticastNotification(tokens, payload);

      // 6. Handle results: Clean up dead tokens and log status
      if (sendResult.deadTokens && sendResult.deadTokens.length > 0) {
        await cleanupDeadTokens(sendResult.deadTokens);
      }

      const logEntries = [];
      const tokenToUserMap = {};
      subscriptions.forEach(sub => {
        tokenToUserMap[sub.fcm_token] = sub.user_id;
      });

      // Track the overall notification status per user (since they may have multiple tokens)
      const userStatusMap = {}; 
      const userErrorMap = {};  

      tokens.forEach((token, idx) => {
        const userId = tokenToUserMap[token];
        const response = sendResult.responses[idx];
        
        if (response.success) {
          // If any device succeeds, the notification was successfully sent to the user
          userStatusMap[userId] = 'sent';
        } else {
          // Only record a failure if we haven't already had a success for this user
          if (userStatusMap[userId] !== 'sent') {
            userStatusMap[userId] = 'failed';
            userErrorMap[userId] = response.error?.message || 'Unknown FCM error';
          }
        }
      });

      // Prepare records for notification_log
      for (const userId of usersToNotify) {
        const status = userStatusMap[userId] || 'failed'; // Default to failed if unknown
        logEntries.push({
          user_id: userId,
          anime_id: animeId,
          episode_number: String(episodeNo),
          status: status,
          error_message: status === 'failed' ? (userErrorMap[userId] || 'Failed for unknown reasons') : null
        });
      }

      // 7. Insert logs in bulk
      if (logEntries.length > 0) {
        const { error: insertLogError } = await supabase
          .from('notification_log')
          .insert(logEntries);

        if (insertLogError) {
          console.error(`Error inserting notification logs for anime ${animeId}:`, insertLogError);
        } else {
          console.log(`Successfully logged ${logEntries.length} notification outcomes for anime ${animeId}.`);
        }
      }
    }
    
    console.log('Notification processing completed.');
  } catch (error) {
    console.error('Unexpected error during notification processing:', error);
  }
};

export const initNotificationScheduler = () => {
  // Run every 2 hours
  cron.schedule('0 */2 * * *', () => {
    processNotifications();
  });
  console.log('Notification scheduler initialized (runs every 2 hours).');
};
