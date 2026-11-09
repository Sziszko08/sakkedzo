import { defaultStats } from './types';
import type { AppStats, Motif, MotifStats } from './types';

const KEY = 'sakkedzo-stats-v1';

export function loadStats(): AppStats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStats();
    const parsed = JSON.parse(raw) as AppStats;
    const base = defaultStats();
    return {
      ...base,
      ...parsed,
      motifStats: { ...base.motifStats, ...parsed.motifStats },
      daily: { ...base.daily, ...parsed.daily },
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: AppStats): void {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function motifAccuracy(s: MotifStats): number {
  const t = s.correct + s.incorrect;
  if (t === 0) return 1;
  return s.correct / t;
}

export function getWeakMotifs(
  motifStats: Record<Motif, MotifStats>,
  minAttempts = 2,
): Motif[] {
  const motifs = Object.keys(motifStats) as Motif[];
  return motifs
    .map((m) => ({
      m,
      acc: motifAccuracy(motifStats[m]),
      attempts: motifStats[m].correct + motifStats[m].incorrect,
    }))
    .filter((x) => x.attempts >= minAttempts)
    .sort((a, b) => a.acc - b.acc || b.attempts - a.attempts)
    .map((x) => x.m);
}
