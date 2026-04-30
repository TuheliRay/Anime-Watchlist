import { supabase } from '../utils/supabase';

// This file contains all the database queries for the user_anime table based on your schema.

export const animeService = {
  
  //1. GET ALL ANIME (When the page loads)
  // Fetches the user's entire watchlist.
  async getUserWatchlist(userId: string) {
    const { data, error } = await supabase
      .from('user_anime')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  },

  //2. ADD AN ANIME (Two-Step Process)
  // Step 1: Ensure the anime exists in the main 'anime' table.
  // Step 2: Link the anime to the user in 'user_anime'.
   
  async addAnime(userId: string, animeData: any, status: string) {
    // STEP 1: Upsert into the main 'anime' table
    // (If it already exists, it just updates it or does nothing)
    const { error: animeError } = await supabase
      .from('anime')
      .upsert({ 
        mal_id: animeData.mal_id, 
        title: animeData.title
      }, { onConflict: 'mal_id' });

    if (animeError) throw animeError;

    // STEP 2: Insert the relationship into 'user_anime'
    const { error: userAnimeError } = await supabase
      .from('user_anime')
      .insert([{ 
        user_id: userId, 
        anime_id: animeData.mal_id, 
        status: status,
        notify_enabled: false 
      }]);
      
    if (userAnimeError) throw userAnimeError;
    return true;
  },

   //3. DELETE AN ANIME
   // Removes the row where the user_id and anime_id match.

  async deleteAnime(userId: string, animeId: number) {
    const { error } = await supabase
      .from('user_anime')
      .delete()
      .match({ user_id: userId, anime_id: animeId }); // Match ensures we only delete this user's specific anime
      
    if (error) throw error;
    return true;
  },

  //4. UPDATE STATUS
  // when a user changes anime status
   
  async updateStatus(userId: string, animeId: number, newStatus: string) {
    const { error } = await supabase
      .from('user_anime')
      .update({ status: newStatus })
      .match({ user_id: userId, anime_id: animeId });
      
    if (error) throw error;
    return true;
  },

  //5. TOGGLE PUSH NOTIFICATIONS
  // when the user clicks the bell icon/notification button.
  
  async toggleNotifications(userId: string, animeId: number, isEnabled: boolean) {
    const { error } = await supabase
      .from('user_anime')
      .update({ notify_enabled: isEnabled })
      .match({ user_id: userId, anime_id: animeId });
      
    if (error) throw error;
    return true;
  }
};
