import{ useState, useEffect , useRef } from "react";
import Header from "./components/Header"; 
import PersonalLists from "./components/PersonalLists"; 
import SeasonalAnime from "./components/SeasonalAnime";   
import AddAnimeForm from "./components/AddAnimeForm";
import StatusCards from "./components/StatusCards";
import AnimeContext from "./components/AnimeContext"; 
import type { AnimeStatus , Anime, PersonalList, PrefillData} from "./types";

export default function App() {
  const headerRef = useRef(null);
  const listsRef = useRef(null);

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

  const addAnimeToList = (anime : Anime) => {
    setPersonalList((prev) => {
      const newAnimeWithTimestamp = { ...anime, addedAt: new Date().toISOString() };
      return {
        ...prev,
        [anime.status]: [newAnimeWithTimestamp, ...prev[anime.status]],
      };
    });
    setJustAdded(true);
  };
  const removeAnimeFromList = (status : AnimeStatus , id : number | string) => {
  setPersonalList((prev) => ({
    ...prev,
    [status]: prev[status].filter((anime) => anime.id !== id),
  }));
};


  return (
    <AnimeContext.Provider value={{ personalList, addAnimeToList ,removeAnimeFromList, prefillData, setPrefillData}}>
      <div className="min-h-screen bg-[#0b1220] text-white">
        
        <Header ref={headerRef}/>
        <AddAnimeForm/>
        <StatusCards />
        <SeasonalAnime scrollToForm={scrollToForm}/>
        <PersonalLists ref={listsRef}/>

      </div>
    </AnimeContext.Provider>
  );
}