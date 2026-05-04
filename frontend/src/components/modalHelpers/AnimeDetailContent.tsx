import type { AnimeDetailContentProps } from "../../types/animeModal";
import Row from "./Row";

export default function AnimeDetailContent({ loading, error, detail }: AnimeDetailContentProps) {
  if (loading) {
    return (
      <p className="text-gray-400 text-sm animate-pulse text-center py-8">
        Fetching details…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm text-center py-8">
        Failed to load details.
      </p>
    );
  }

  if (!detail) return null;

  return (
    <div className="divide-y divide-[#2a3a55]">
      <Row
        label="Status"
        value={detail.status}
        valueClass={detail.isOngoing ? "text-green-400" : "text-blue-400"}
      />
      <Row
        label="Total Episodes"
        value={detail.totalEpisodes != null ? String(detail.totalEpisodes) : "—"}
      />
      <Row
        label={detail.isOngoing ? "Latest Episode" : "Last Episode"}
        value={detail.latestEpisode != null ? `Ep ${detail.latestEpisode}` : "—"}
      />
      <Row
        label="Next Airing"
        value={detail.isOngoing ? (detail.nextAiring ?? "—") : "—"}
      />
    </div>
  );
}
