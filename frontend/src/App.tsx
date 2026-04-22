import { useState, useEffect, useRef } from "react";
import Header from "./components/Header"; 
import PersonalLists from "./components/PersonalLists"; 
import SeasonalAnime from "./components/SeasonalAnime";   
import AddAnimeForm from "./components/AddAnimeForm";
import StatusCards from "./components/StatusCards";
import AnimeContext from "./components/AnimeContext"; 
import Auth from "./components/Auth";
import { supabase } from "./utils/supabase";
import type { AnimeStatus, Anime, PersonalList, PrefillData } from "./types";
import type { Session } from "@supabase/supabase-js";

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

  const scrollToForm = () => {
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToList = () => {
    listsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [personalList, setPersonalList] = useState<PersonalList>(() => {
    try {
      const raw = localStorage.getItem("anime_personal_list");
      return raw ? JSON.parse(raw) : { Watching: [], Completed: [], "Plan to Watch": [] };
    } catch {
      return { Watching: [], Completed: [], "Plan to Watch": [] };
    }
  });

  useEffect(() => {
    localStorage.setItem("anime_personal_list", JSON.stringify(personalList));
  }, [personalList]);

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

  const removeAnimeFromList = (status: AnimeStatus, id: number | string) => {
    setPersonalList((prev) => ({
      ...prev,
      [status]: prev[status].filter((anime) => anime.id !== id),
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
    <AnimeContext.Provider value={{ personalList, addAnimeToList, removeAnimeFromList, prefillData, setPrefillData }}>
      <div className="min-h-screen bg-[#0b1220] text-white">
        <div className="flex justify-end p-4 max-w-6xl mx-auto">
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded-lg text-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
        <Header ref={headerRef}/>
        <AddAnimeForm/>
        <StatusCards />
        <SeasonalAnime scrollToForm={scrollToForm}/>
        <PersonalLists ref={listsRef}/>
      </div>
    </AnimeContext.Provider>
  );
}