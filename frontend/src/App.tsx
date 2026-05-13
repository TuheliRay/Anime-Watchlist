import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import PersonalLists from "./components/PersonalLists";
import SeasonalAnime from "./components/SeasonalAnime";
import AddAnimeForm from "./components/AddAnimeForm";
import StatusCards from "./components/StatusCards";
import AnimeContext from "./components/AnimeContext";
import AuthContext from "./components/AuthContext";
import Auth from "./components/Auth";
import { supabase } from "./utils/supabase";
import type { AnimeStatus, Anime, PersonalList, PrefillData } from "./types";
import type { Session } from "@supabase/supabase-js";
import { animeService } from "./services/animeService";
import { setupForegroundMessageListener } from "../lib/notifications";

export default function App() {
  const headerRef = useRef<HTMLElement>(null);
  const listsRef = useRef<HTMLElement>(null);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Setup Firebase foreground message listener
    const unsubscribe = setupForegroundMessageListener();

    // Cleanup the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const scrollToForm = () => {
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToList = () => {
    listsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [personalList, setPersonalList] = useState<PersonalList>({ Watching: [], Completed: [], "Plan to Watch": [] });

  //Fetch watchlist from Supabase when the app starts
  useEffect(() => {
    if (!session) {
      setPersonalList({ Watching: [], Completed: [], "Plan to Watch": [] });
      return;
    }

    const loadWatchlist = async () => {
      try {
        const data = await animeService.getUserWatchlist(session.user.id);
        const newList: PersonalList = { Watching: [], Completed: [], "Plan to Watch": [] };
        //go through the data if it exists
        data?.forEach((row: any) => {
          const status = row.status as AnimeStatus;
          if (newList[status]) {
            newList[status].push({
              mal_id: row.anime_id,
              title: row.anime?.title || "Unknown",
              genre: row.anime?.genre || "",
              status,
              addedAt: row.created_at,
              notify_enabled: row.notify_enabled,
            });
          }
        });
        setPersonalList(newList);
      } catch (err) {
        console.error("Failed to load watchlist", err);
      }
    };

    loadWatchlist();
  }, [session]);

  useEffect(() => {
    if (justAdded) {
      scrollToList();
      setJustAdded(false);
    }
  }, [personalList, justAdded]);

  const addAnimeToList = (anime: Anime) => {
    setPersonalList((prev) => {
      const newAnimeWithTimestamp = { ...anime, addedAt: new Date().toISOString() };
      return {
        ...prev,
        [anime.status]: [newAnimeWithTimestamp, ...prev[anime.status]],
      };
    });
    setJustAdded(true);
  };

  const removeAnimeFromList = async (status: AnimeStatus, mal_id: number) => {
    //remove from UI
    setPersonalList((prev) => ({
      ...prev,
      [status]: prev[status].filter((anime) => anime.mal_id !== mal_id),
    }));
    //remove from database 
    if (session) {
      try {
        await animeService.deleteAnime(session.user.id, mal_id)
      } catch (error) {
        console.error("Failed to remove anime from Supabase:", error);
      }
    }
  };
  //toggle notification
  const toggleNotificationState = (mal_id: number) => {
    setPersonalList((prev) => ({
      ...prev,
      Watching: prev.Watching.map((anime) =>
        anime.mal_id === mal_id
          ? { ...anime, notify_enabled: !anime.notify_enabled }
          : anime
      ),
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white">
        <Header ref={headerRef} />
        <Auth />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={session}>
      <AnimeContext.Provider value={{ personalList, addAnimeToList, removeAnimeFromList, toggleNotificationState, prefillData, setPrefillData }}>
        <div className="min-h-screen bg-[#0b1220] text-white">
          <div className="flex justify-end p-4 max-w-6xl mx-auto">
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded-lg text-gray-300 transition"
            >
              Sign Out
            </button>
          </div>
          <Header ref={headerRef} />
          <AddAnimeForm />
          <StatusCards />
          <SeasonalAnime scrollToForm={scrollToForm} />
          <PersonalLists ref={listsRef} />
        </div>
      </AnimeContext.Provider>
    </AuthContext.Provider>
  );
}