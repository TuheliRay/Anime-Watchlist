import { useEffect, useState, useContext } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import AnimeContext from "./AnimeContext";
import axios from "axios";

export default function SeasonalAnime({scrollToForm}) {
  const { setPrefillData, personalList } = useContext(AnimeContext);

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonInfo, setSeasonInfo] = useState({ season: "", year: "" });

  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

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
          `https://api.jikan.moe/v4/seasons/${year}/${season}`
        );
        const uniqueAnime = [];
        const seenIds = new Set();

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

  const isAnimeInList = (id) => {
    return (
      personalList.Watching.some((a) => a.mal_id === id) ||
      personalList.Completed.some((a) => a.mal_id === id) ||
      personalList["Plan to Watch"].some((a) => a.mal_id === id)
    );
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-500 mb-10 text-center mx-auto w-fit">
          {seasonInfo.season.charAt(0).toUpperCase() + seasonInfo.season.slice(1)}{" "}
          {seasonInfo.year} Anime Lineup
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {animeList.map((anime) => {
            const alreadyAdded = isAnimeInList(anime.mal_id);

            return (
              <div
                key={anime.mal_id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
              >
                <div className="relative">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  {anime.score && (
                    <span className="absolute top-0 right-0 bg-black bg-opacity-75 text-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg">
                      {anime.score}
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-gray-200 truncate">
                    {anime.titles.find((t) => t.type === "English")?.title ||
                      anime.title}
                  </h3>
                  <button
                    onClick={() => {
                      if (!alreadyAdded) {
                        const animeData = {
                          mal_id: anime.mal_id,
                          title:
                            anime.titles.find((t) => t.type === "English")?.title ||
                            anime.title,
                          genre: anime.genres.map((g) => g.name).join(", "),
                          status: "Plan to Watch",
                        };
                        setPrefillData(animeData);
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
  );
}