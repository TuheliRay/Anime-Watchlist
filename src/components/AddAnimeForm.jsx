import  { useState } from "react";
import { useContext , useEffect } from "react";
import AnimeContext from "./AnimeContext";

export default function AddAnimeForm({scrollToList}) {
  const { addAnimeToList, prefillData, setPrefillData } = useContext(AnimeContext);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Watching");

  useEffect(() => {
    if (prefillData) {
      setTitle(prefillData.title || "");
      setGenre(prefillData.genre || "");
      setStatus(prefillData.status || "Watching");
    }
  }, [prefillData]);

  function handleAddAnime(e) {
    e.preventDefault();
    if (!title.trim()) return;

    addAnimeToList({
      id: prefillData?.mal_id || Date.now(),
      mal_id: prefillData?.mal_id,
      title: title.trim(),
      genre: genre.trim(),
      status,
    });
    scrollToList()
  

    // clear form & prefill
    setTitle("");
    setGenre("");
    setStatus("Watching");
    setPrefillData(null);
  }

  return (
    <section className="mt-8">
      <div className="bg-[#1f2832] rounded-2xl p-4 pb-7 shadow-lg max-w-7xl mx-auto mb-10">
        <h3 className="text-2xl text-pink-300 font-semibold mb-4">
          Add New Anime
        </h3>
        <form
          onSubmit={handleAddAnime}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-4">
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Attack on Titan"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-gray-300 mb-1">Genre</label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Action Heavy"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            >
              <option>Watching</option>
              <option>Completed</option>
              <option>Plan to Watch</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit" 
              className="w-full h-10 rounded-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 shadow hover:opacity-90 transition"
            >
              Add Anime
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
