import { getMessaging } from 'firebase-admin/messaging';
import { supabase } from './supabase.js';

/**
 * Sends a multicast notification to an array of tokens in batches of 500.
 * @param {string[]} tokens - Array of FCM registration tokens.
 * @param {object} payload - Notification payload containing title, episode_number, airing_time, image_url, anime_id.
 * @returns {Promise<{successCount: number, failureCount: number, deadTokens: string[], responses: any[]}>}
 */
export const sendMulticastNotification = async (tokens, payload) => {
  if (!tokens || tokens.length === 0) {
    return { successCount: 0, failureCount: 0, deadTokens: [], responses: [] };
  }

  const { title, episode_number, airing_time, image_url, anime_id } = payload;
  
  // Data-only message: ensures the service worker's onBackgroundMessage handler
  // is always triggered, giving us full control over notification display and click behavior.
  // When a "notification" key is present, FCM auto-displays and skips the SW handler.
  const messageTemplate = {
    data: {
      title: `${title || 'Anime Alert'}`,
      body: `Episode ${episode_number || 'next'} is airing soon!`,
      anime_id: String(anime_id || ''),
      episode_number: String(episode_number || ''),
      airing_time: String(airing_time || ''),
      image_url: image_url || '',
      url: `/anime/${anime_id || ''}`
    }
  };

  const BATCH_SIZE = 500;
  let successCount = 0;
  let failureCount = 0;
  const deadTokens = [];
  const responses = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const tokensBatch = tokens.slice(i, i + BATCH_SIZE);
    
    const message = {
      ...messageTemplate,
      tokens: tokensBatch,
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message);
      
      successCount += response.successCount;
      failureCount += response.failureCount;

      response.responses.forEach((resp, idx) => {
        responses.push(resp);
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            deadTokens.push(tokensBatch[idx]);
          }
        }
      });
    } catch (error) {
      console.error('Error sending multicast batch:', error);
      // Even if batch fails, we record failures
      failureCount += tokensBatch.length;
    }
  }

  return { successCount, failureCount, deadTokens, responses };
};

/**
 * Helper to remove dead tokens from the database.
 * @param {string[]} deadTokens 
 */
export const cleanupDeadTokens = async (deadTokens) => {
  if (!deadTokens || deadTokens.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('push_subscription')
      .delete()
      .in('fcm_token', deadTokens);

    if (error) {
      console.error('Failed to clean up dead tokens from database:', error);
    } else {
      console.log(`Successfully cleaned up ${deadTokens.length} dead tokens.`);
    }
  } catch (err) {
    console.error('Error during dead token cleanup:', err);
  }
};
