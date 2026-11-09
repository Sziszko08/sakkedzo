import { useCallback, useEffect, useState } from 'react';
import { loadStats, saveStats, todayISO } from '../storage';
import type { AppStats, Difficulty, HistoryEntry, Motif } from '../types';

export function useStats() {
  const [stats, setStats] = useState<AppStats>(() => loadStats());

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const recordResult = useCallback(
    (
      puzzleId: string,
      correct: boolean,
      motifs: Motif[],
      difficulty: Difficulty,
      mode: 'daily' | 'tactics',
    ) => {
      setStats((prev) => {
        const next: AppStats = {
          ...prev,
          motifStats: { ...prev.motifStats },
          history: [...prev.history],
          daily: { ...prev.daily, completedIds: [...prev.daily.completedIds] },
        };
        next.totalCorrect += correct ? 1 : 0;
        next.totalIncorrect += correct ? 0 : 1;
        if (correct) {
          next.streak = prev.streak + 1;
          next.bestStreak = Math.max(prev.bestStreak, next.streak);
        } else {
          next.streak = 0;
        }
        next.lastPlayDate = todayISO();
        for (const m of motifs) {
          const ms = { ...next.motifStats[m] };
          if (correct) ms.correct += 1;
          else ms.incorrect += 1;
          next.motifStats[m] = ms;
        }
        const entry: HistoryEntry = {
          date: todayISO(),
          mode,
          puzzleId,
          correct,
          motifs,
          difficulty,
        };
        next.history = [entry, ...next.history].slice(0, 200);
        if (mode === 'daily') {
          if (!next.daily.completedIds.includes(puzzleId)) {
            next.daily.completedIds.push(puzzleId);
            if (correct) next.daily.correctCount += 1;
          }
        }
        return next;
      });
    },
    [],
  );

  const ensureDailySet = useCallback((puzzleIds: string[]) => {
    const today = todayISO();
    setStats((prev) => {
      if (prev.daily.date === today && prev.daily.puzzleIds.length > 0) {
        return prev;
      }
      return {
        ...prev,
        daily: {
          date: today,
          puzzleIds,
          completedIds: [],
          correctCount: 0,
        },
      };
    });
  }, []);

  const resetDailyIfNeeded = useCallback(() => {
    const today = todayISO();
    setStats((prev) => {
      if (prev.daily.date === today) return prev;
      return {
        ...prev,
        daily: {
          date: today,
          puzzleIds: [],
          completedIds: [],
          correctCount: 0,
        },
      };
    });
  }, []);

  return { stats, setStats, recordResult, ensureDailySet, resetDailyIfNeeded };
}
