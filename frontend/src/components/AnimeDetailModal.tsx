import { useEffect, useState } from "react";
import axios from "axios";
import { X as XIcon } from "lucide-react";
import type { AnimeDetailModalProps, DetailState } from "../types/animeDetail";
import AnimeDetailContent from "./modalHelpers/AnimeDetailContent";

export default function AnimeDetailModal({ malId, title, onClose }: AnimeDetailModalProps) {
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await axios.get(
          `${import.meta.env.VITE_JIKAN_API_URL}/anime/${malId}/full`
        );
        const d = res.data.data;

        let latestEpisode: number | null = null;

        if (d.airing) {
          try {
            const epRes = await axios.get(
              `${import.meta.env.VITE_JIKAN_API_URL}/anime/${malId}/episodes`
            );
            const eps: { mal_id: number }[] = epRes.data.data || [];
            if (eps.length > 0) latestEpisode = eps[eps.length - 1].mal_id;
          } catch {
            // non-fatal
          }
        }

        setDetail({
          isOngoing: d.airing,
          status: d.airing ? "Ongoing" : "Completed",
          totalEpisodes: d.episodes ?? null,
          latestEpisode: d.airing ? latestEpisode : (d.episodes ?? null),
          nextAiring: d.airing ? (d.broadcast?.string ?? null) : null,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [malId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#131e30] border border-[#2a3a55] rounded-2xl w-full max-w-sm p-6 text-gray-200"
        style={{ boxShadow: "0 0 40px rgba(254,53,97,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <h2 className="text-base font-bold text-white pr-6 mb-4 leading-snug">{title}</h2>

        <AnimeDetailContent loading={loading} error={error} detail={detail} />
      </div>
    </div>
  );
}
