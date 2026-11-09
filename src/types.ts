export type Motif =
  | 'villa'
  | 'kotes'
  | 'nyars'
  | 'kettos_tamadas'
  | 'mattkepek'
  | 'felfedezett_tamadas'
  | 'elvonás';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  fen: string;
  /** UCI lépések a teljes megoldási vonalon (játékos + ellenfél válaszok) */
  solution: string[];
  motifs: Motif[];
  difficulty: Difficulty;
  magyarazat: string;
}

export const MOTIF_LABELS: Record<Motif, string> = {
  villa: 'Villa',
  kotes: 'Kötés',
  nyars: 'Nyárs',
  kettos_tamadas: 'Kettős támadás',
  mattkepek: 'Mattképek',
  felfedezett_tamadas: 'Felfedezett támadás',
  elvonás: 'Elvonás',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Könnyű',
  medium: 'Közepes',
  hard: 'Nehéz',
};

export type Screen =
  | 'home'
  | 'daily'
  | 'tactics'
  | 'weaknesses'
  | 'stats'
  | 'freeplay';

export interface MotifStats {
  correct: number;
  incorrect: number;
}

export interface HistoryEntry {
  date: string;
  mode: 'daily' | 'tactics';
  puzzleId: string;
  correct: boolean;
  motifs: Motif[];
  difficulty: Difficulty;
}

export interface AppStats {
  totalCorrect: number;
  totalIncorrect: number;
  streak: number;
  bestStreak: number;
  lastPlayDate: string | null;
  motifStats: Record<Motif, MotifStats>;
  history: HistoryEntry[];
  daily: {
    date: string | null;
    puzzleIds: string[];
    completedIds: string[];
    correctCount: number;
  };
}

export function emptyMotifStats(): Record<Motif, MotifStats> {
  return {
    villa: { correct: 0, incorrect: 0 },
    kotes: { correct: 0, incorrect: 0 },
    nyars: { correct: 0, incorrect: 0 },
    kettos_tamadas: { correct: 0, incorrect: 0 },
    mattkepek: { correct: 0, incorrect: 0 },
    felfedezett_tamadas: { correct: 0, incorrect: 0 },
    elvonás: { correct: 0, incorrect: 0 },
  };
}

export function defaultStats(): AppStats {
  return {
    totalCorrect: 0,
    totalIncorrect: 0,
    streak: 0,
    bestStreak: 0,
    lastPlayDate: null,
    motifStats: emptyMotifStats(),
    history: [],
    daily: {
      date: null,
      puzzleIds: [],
      completedIds: [],
      correctCount: 0,
    },
  };
}
