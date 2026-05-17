import { createContext, useContext } from 'react';
import type { AnimeContextType } from '../types';

const AnimeContext = createContext<AnimeContextType | null>(null);

export function useAnimeContext(): AnimeContextType {
  const ctx = useContext(AnimeContext);
  if (!ctx) {
    throw new Error('useAnimeContext must be used within AnimeContext.Provider');
  }
  return ctx;
}

export default AnimeContext;
