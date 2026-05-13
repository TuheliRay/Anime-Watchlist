import cron from 'node-cron';
import { supabase } from '../utils/supabase.js';

// Helper to calculate next airing date in UTC from JST
function getNextAiringDateUTC(day, time) {
    if (!day || !time || day === 'Unknown' || time === 'Unknown') return null;

    const dayMap = {
        'Sundays': 0, 'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3,
        'Thursdays': 4, 'Fridays': 5, 'Saturdays': 6
    };

    const jstDay = dayMap[day];
    if (jstDay === undefined) return null;

    const [jstHours, minutes] = time.split(':').map(Number);
    if (isNaN(jstHours) || isNaN(minutes)) return null;

    // Convert JST schedule to UTC schedule first (JST is UTC+9, so UTC is JST-9)
    let utcHours = jstHours - 9;
    let utcDay = jstDay;

    if (utcHours < 0) {
        utcHours += 24;
        utcDay = (utcDay - 1 + 7) % 7;
    }

    // Now calculate next occurrence using pure UTC natively
    const now = new Date();
    const nextAiring = new Date(now);

    nextAiring.setUTCHours(utcHours, minutes, 0, 0);

    let daysUntil = (utcDay - nextAiring.getUTCDay() + 7) % 7;

    // If the target time has already passed today, schedule for next week
    if (daysUntil === 0 && now.getTime() > nextAiring.getTime()) {
        daysUntil = 7;
    }

    nextAiring.setUTCDate(nextAiring.getUTCDate() + daysUntil);

    return nextAiring.toISOString();
}

async function fetchAllAiringAnime() {
    let page = 1;
    let hasNextPage = true;
    const airingAnime = [];

    while (hasNextPage) {
        try {
            // Jikan API rate limit: 3 requests per second
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}`);

            if (!response.ok) {
                console.error(`Error fetching Jikan API page ${page}: ${response.statusText}`);
                break;
            }

            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                airingAnime.push(...data.data);
            }

            hasNextPage = data.pagination?.has_next_page || false;
            page++;
        } catch (error) {
            console.error(`Error fetching airing anime on page ${page}:`, error);
            break;
        }
    }

    return airingAnime;
}

export const syncAiringAnime = async () => {
    console.log('Starting airing anime sync...');

    try {
        const airingAnimeList = await fetchAllAiringAnime();
        console.log(`Fetched ${airingAnimeList.length} airing anime.`);

        if (airingAnimeList.length === 0) {
            console.log('No airing anime found to sync.');
            return;
        }

        // Fetch existing mal_ids from the anime table
        const { data: existingAnime, error: fetchError } = await supabase
            .from('anime')
            .select('mal_id');

        if (fetchError) {
            console.error('Error fetching existing anime from Supabase:', fetchError);
            return;
        }

        const existingMalIds = new Set(existingAnime.map(a => a.mal_id));
        const updates = [];

        for (const anime of airingAnimeList) {
            // Only process animes that are present in our database
            if (!existingMalIds.has(anime.mal_id)) {
                continue;
            }

            const broadcast = anime.broadcast;
            if (!broadcast || !broadcast.day || !broadcast.time) {
                continue;
            }

            // We assume timezone is JST (Asia/Tokyo) as provided by Jikan
            const nextAiringUTC = getNextAiringDateUTC(broadcast.day, broadcast.time);

            if (nextAiringUTC) {
                updates.push({
                    mal_id: anime.mal_id,
                    next_episode_airing_at: nextAiringUTC
                });
            }
        }

        console.log(`Prepared ${updates.length} records for update.`);

        // Update in parallel batches to avoid overloading the Supabase API
        const batchSize = 10;
        for (let i = 0; i < updates.length; i += batchSize) {
            const batch = updates.slice(i, i + batchSize);

            await Promise.all(batch.map(async (record) => {
                const { error } = await supabase
                    .from('anime')
                    .update({ next_episode_airing_at: record.next_episode_airing_at })
                    .eq('mal_id', record.mal_id);

                if (error) {
                    console.error(`Error updating anime ${record.mal_id}:`, error);
                }
            }));
        }

        console.log('Airing anime sync completed successfully.');
    } catch (error) {
        console.error('Unexpected error during anime sync:', error);
    }
};

export const initEpisodeSyncScheduler = () => {
    // Run every 12 hours
    cron.schedule('0 */12 * * *', () => {
        syncAiringAnime();
    });
    console.log('Episode sync scheduler initialized (runs every 12 hours).');
};
