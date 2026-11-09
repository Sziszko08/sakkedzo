import { useEffect, useMemo, useState } from 'react';
import { Home } from './components/Home';
import { PuzzleSession } from './components/PuzzleSession';
import { FreePlay } from './components/FreePlay';
import { StatsView } from './components/StatsView';
import { Weaknesses } from './components/Weaknesses';
import { TacticsSetup } from './components/TacticsSetup';
import { useStats } from './hooks/useStats';
import { filterPuzzles, PUZZLES } from './data/puzzles';
import { getWeakMotifs, todayISO } from './storage';
import { dateSeed, seededShuffle } from './utils/chessHelpers';
import type { Difficulty, Motif, Puzzle, Screen } from './types';
import './App.css';

type AppScreen = Screen | 'tactics-setup' | 'tactics-play' | 'weak-play';

function pickDaily(today: string): Puzzle[] {
  const pool = PUZZLES.filter((p) => p.solution.length > 0);
  const shuffled = seededShuffle(pool, dateSeed(today));
  const easy = shuffled.filter((p) => p.difficulty === 'easy');
  const med = shuffled.filter((p) => p.difficulty === 'medium');
  const hard = shuffled.filter((p) => p.difficulty === 'hard');
  const pick: Puzzle[] = [];
  for (let i = 0; i < 4 && easy[i]; i++) pick.push(easy[i]);
  for (let i = 0; i < 4 && med[i]; i++) pick.push(med[i]);
  for (let i = 0; i < 2 && hard[i]; i++) pick.push(hard[i]);
  let i = 0;
  while (pick.length < 10 && i < shuffled.length) {
    const p = shuffled[i++];
    if (p && !pick.find((x) => x.id === p.id)) pick.push(p);
  }
  return seededShuffle(pick, dateSeed(today) + 7).slice(0, 10);
}

export default function App() {
  const { stats, recordResult, ensureDailySet, resetDailyIfNeeded } = useStats();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [tacticsQueue, setTacticsQueue] = useState<Puzzle[]>([]);
  const [setupMotifs, setSetupMotifs] = useState<Motif[]>([]);

  useEffect(() => {
    resetDailyIfNeeded();
  }, [resetDailyIfNeeded]);

  const dailyPuzzles = useMemo(() => {
    const today = todayISO();
    if (stats.daily.date === today && stats.daily.puzzleIds.length > 0) {
      return stats.daily.puzzleIds
        .map((id) => PUZZLES.find((p) => p.id === id))
        .filter((p): p is Puzzle => !!p);
    }
    return pickDaily(today);
  }, [stats.daily.date, stats.daily.puzzleIds]);

  const openDaily = () => {
    ensureDailySet(dailyPuzzles.map((p) => p.id));
    setScreen('daily');
  };

  const startTactics = (opts: { motifs: Motif[]; difficulty: Difficulty | null }) => {
    const weak = getWeakMotifs(stats.motifStats, 2);
    let list = filterPuzzles({
      motifs: opts.motifs.length ? opts.motifs : undefined,
      difficulty: opts.difficulty,
      weakBias: weak,
    });
    list = seededShuffle(list, Date.now() % 100000).slice(0, 12);
    setTacticsQueue(list);
    setScreen('tactics-play');
  };

  const practiceWeak = (motifs: Motif[]) => {
    let list = filterPuzzles({ motifs, weakBias: motifs });
    list = seededShuffle(list, Date.now() % 100000).slice(0, 10);
    setTacticsQueue(list);
    setScreen('weak-play');
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <Home
          stats={stats}
          onNavigate={(s) => {
            if (s === 'daily') openDaily();
            else if (s === 'tactics') setScreen('tactics-setup');
            else setScreen(s);
          }}
        />
      )}

      {screen === 'daily' && (
        <PuzzleSession
          title="Napi edzés"
          puzzles={
            stats.daily.puzzleIds.length
              ? stats.daily.puzzleIds
                  .map((id) => PUZZLES.find((p) => p.id === id)!)
                  .filter(Boolean)
              : dailyPuzzles
          }
          mode="daily"
          stats={stats}
          completedIds={stats.daily.completedIds}
          onResult={recordResult}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'tactics-setup' && (
        <TacticsSetup
          initialMotifs={setupMotifs}
          onExit={() => {
            setSetupMotifs([]);
            setScreen('home');
          }}
          onStart={startTactics}
        />
      )}

      {(screen === 'tactics-play' || screen === 'weak-play') && (
        <PuzzleSession
          title={screen === 'weak-play' ? 'Gyenge pontok gyakorlása' : 'Taktikai gyakorlás'}
          puzzles={tacticsQueue}
          mode="tactics"
          stats={stats}
          onResult={recordResult}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'weaknesses' && (
        <Weaknesses
          stats={stats}
          onExit={() => setScreen('home')}
          onPractice={practiceWeak}
        />
      )}

      {screen === 'stats' && (
        <StatsView stats={stats} onExit={() => setScreen('home')} />
      )}

      {screen === 'freeplay' && <FreePlay onExit={() => setScreen('home')} />}
    </div>
  );
}
