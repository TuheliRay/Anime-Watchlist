export interface AnimeDetailModalProps {
  malId: number;
  title: string;
  onClose: () => void;
}

export interface DetailState {
  status: string;
  isOngoing: boolean;
  totalEpisodes: number | null;
  latestEpisode: number | null;
  nextAiring: string | null;
}

export interface AnimeDetailContentProps {
  loading: boolean;
  error: boolean;
  detail: DetailState | null;
}

export interface RowProps {
  label: string;
  value: string;
  valueClass?: string;
}
