import { useEffect, useState, useContext } from "react";
import { Check as CheckIcon } from "lucide-react";
import AnimeContext from "./AnimeContext";
import AnimeDetailModal from "./AnimeDetailModal";
import axios from "axios";
import type { Anime, Scroll , SeasonalAnimeItem } from "../types";

export default function SeasonalAnime({ scrollToForm }: Scroll) {
  const { setPrefillData, personalList } = useContext(AnimeContext)!;

  const [animeList, setAnimeList] = useState<SeasonalAnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonInfo, setSeasonInfo] = useState({ season: "", year: "" });

  // Modal state
  const [selectedAnime, setSelectedAnime] = useState<{
    malId: number;
    title: string;
  } | null>(null);

  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString();

    let season = "";
    if (month >= 1 && month <= 3) season = "winter";
    else if (month >= 4 && month <= 6) season = "spring";
    else if (month >= 7 && month <= 9) season = "summer";
    else season = "fall";

    return { season, year };
  };

  useEffect(() => {
    const { season, year } = getCurrentSeason();
    setSeasonInfo({ season, year });

    const fetchSeasonalAnime = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_JIKAN_API_URL}/seasons/${year}/${season}`
        );
        const uniqueAnime: SeasonalAnimeItem[] = [];
        const seenIds = new Set<number>();

        for (const anime of response.data.data) {
          if (!seenIds.has(anime.mal_id)) {
            seenIds.add(anime.mal_id);
            uniqueAnime.push(anime);
          }
        }
        setAnimeList(uniqueAnime);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonalAnime();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Fetching seasonal anime...
      </div>
    );
  }

  const isAnimeInList = (id: number | string) => {
    return (
      personalList.Watching.some((a) => a.mal_id === id) ||
      personalList.Completed.some((a) => a.mal_id === id) ||
      personalList["Plan to Watch"].some((a) => a.mal_id === id)
    );
  };

  return (
    <>
      <section className="px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-500 mb-10 text-center mx-auto w-fit">
            {seasonInfo.season.charAt(0).toUpperCase() + seasonInfo.season.slice(1)}{" "}
            {seasonInfo.year} Anime Lineup
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime) => {
              const alreadyAdded = isAnimeInList(anime.mal_id);
              const displayTitle =
                anime.titles.find((t) => t.type === "English")?.title ||
                anime.title;

              return (
                <div
                  key={anime.mal_id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col group cursor-pointer"
                  onClick={() =>
                    setSelectedAnime({ malId: anime.mal_id, title: displayTitle })
                  }
                >
                  <div className="relative">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full aspect-[3/4] object-cover transition duration-300 group-hover:brightness-75"
                    />
                    {anime.score && (
                      <span className="absolute top-0 right-0 bg-black bg-opacity-75 text-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg">
                        {anime.score}
                      </span>
                    )}
                    {/* Info hint overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-gray-200 truncate">
                      {displayTitle}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // don't open modal
                        if (!alreadyAdded) {
                          const animeData = {
                            mal_id: anime.mal_id,
                            title: displayTitle,
                            genre: anime.genres.map((g) => g.name).join(", "),
                            status: "Plan to Watch",
                          };
                          setPrefillData(animeData as Anime);
                          scrollToForm();
                        }
                      }}
                      disabled={alreadyAdded}
                      className={`mt-3 w-full text-xs font-bold py-2 rounded-md transition ${
                        alreadyAdded
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-[#fe3561] text-white"
                      }`}
                    >
                      {alreadyAdded ? (
                        <>
                          <CheckIcon className="w-4 h-4 stroke-[2.5] inline mr-1" />
                          On Your List
                        </>
                      ) : (
                        "+ Add to List"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAnime && (
        <AnimeDetailModal
          malId={selectedAnime.malId}
          title={selectedAnime.title}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </>
  );
}