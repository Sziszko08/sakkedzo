import type { AppStats } from '../types';
import { todayISO } from '../storage';

interface Props {
  stats: AppStats;
  onNavigate: (screen: 'daily' | 'tactics' | 'weaknesses' | 'stats' | 'freeplay') => void;
}

export function Home({ stats, onNavigate }: Props) {
  const today = todayISO();
  const dailyDone =
    stats.daily.date === today &&
    stats.daily.puzzleIds.length > 0 &&
    stats.daily.completedIds.length >= stats.daily.puzzleIds.length;
  const dailyProgress =
    stats.daily.date === today && stats.daily.puzzleIds.length
      ? `${stats.daily.completedIds.length}/${stats.daily.puzzleIds.length}`
      : null;

  const items = [
    {
      id: 'daily' as const,
      title: 'Napi edzés',
      desc: dailyDone
        ? 'Mai edzés kész! Holnap új feladatok várnak.'
        : dailyProgress
          ? `Folyamatban: ${dailyProgress} feladat`
          : '8–12 feladat, kb. 10–15 perc',
      emoji: '📅',
    },
    {
      id: 'tactics' as const,
      title: 'Taktikai gyakorlás',
      desc: 'Motívumok és nehézség szerint',
      emoji: '🎯',
    },
    {
      id: 'weaknesses' as const,
      title: 'Gyenge pontok',
      desc: 'Alacsony pontosságú minták célzottan',
      emoji: '🔍',
    },
    {
      id: 'stats' as const,
      title: 'Statisztikák',
      desc: `Pontosság és sorozat · legjobb: ${stats.bestStreak}`,
      emoji: '📊',
    },
    {
      id: 'freeplay' as const,
      title: 'Szabad játék',
      desc: 'Mindkét oldalon, FEN betöltés, elemzés',
      emoji: '♟️',
    },
  ];

  return (
    <div className="home">
      <header className="hero">
        <h1>SakkEdző</h1>
        <p>Taktikai edzés 1000–1500 Elo játékosoknak</p>
        <p className="muted version-tag">verzió: helyben-v4</p>
      </header>
      <nav className="menu" aria-label="Főmenü">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="menu-card"
            onClick={() => onNavigate(item.id)}
          >
            <span className="menu-emoji" aria-hidden>
              {item.emoji}
            </span>
            <span className="menu-text">
              <span className="menu-title">{item.title}</span>
              <span className="menu-desc">{item.desc}</span>
            </span>
            <span className="menu-chevron" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
