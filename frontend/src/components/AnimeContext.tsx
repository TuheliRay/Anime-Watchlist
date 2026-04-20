import { createContext } from 'react';
import type { AnimeContextType } from '../types';

const AnimeContext = createContext<AnimeContextType | null>(null);

export default AnimeContext;