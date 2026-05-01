export type AnimeStatus = "Watching" | "Completed" | "Plan to Watch";

export interface Anime {
    mal_id: number;
    title: string;
    genre: string;
    status: AnimeStatus;
    addedAt?: string;
}

export interface PersonalList {
    Watching: Anime[];
    Completed: Anime[];
    "Plan to Watch": Anime[];
}

export interface PrefillData {
    mal_id?: number;
    title: string;
    genre: string;
    status: AnimeStatus;
}

export interface AnimeContextType {
    personalList: PersonalList;
    addAnimeToList: (anime: Anime) => void;
    removeAnimeFromList: (status: AnimeStatus, id: number) => void;
    prefillData: PrefillData | null;
    setPrefillData: React.Dispatch<React.SetStateAction<PrefillData | null>>;
}

export interface Scroll {
    scrollToForm: () => void;
}

export interface SeasonalAnimeItem {
    mal_id: number;
    title: string;
    titles: { type: string; title: string }[];
    images: { jpg: { image_url: string } };
    score: number | null;
    genres: { name: string }[];
}
