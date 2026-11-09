import type { AppStats } from '../types';
import { MOTIF_LABELS, type Motif } from '../types';
import { motifAccuracy } from '../storage';

interface Props {
  stats: AppStats;
  onExit: () => void;
}

export function StatsView({ stats, onExit }: Props) {
  const total = stats.totalCorrect + stats.totalIncorrect;
  const acc = total === 0 ? 0 : Math.round((stats.totalCorrect / total) * 100);
  const motifs = Object.keys(MOTIF_LABELS) as Motif[];

  return (
    <div className="panel">
      <div className="session-top">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Menü
        </button>
        <h2>Statisztikák</h2>
        <span />
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{acc}%</div>
          <div className="stat-label">Pontosság</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Aktuális sorozat</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bestStreak}</div>
          <div className="stat-label">Legjobb sorozat</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Összes feladat</div>
        </div>
      </div>

      <h3>Motívumok szerint</h3>
      <ul className="motif-list">
        {motifs.map((m) => {
          const s = stats.motifStats[m];
          const a = Math.round(motifAccuracy(s) * 100);
          const attempts = s.correct + s.incorrect;
          return (
            <li key={m}>
              <div className="motif-row">
                <span>{MOTIF_LABELS[m]}</span>
                <span>
                  {attempts === 0 ? '—' : `${a}% (${s.correct}/${attempts})`}
                </span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${attempts ? a : 0}%` }} />
              </div>
            </li>
          );
        })}
      </ul>

      <h3>Legutóbbi eredmények</h3>
      {stats.history.length === 0 ? (
        <p className="empty">Még nincs előzmény. Kezdd a napi edzéssel!</p>
      ) : (
        <ul className="history-list">
          {stats.history.slice(0, 20).map((h, i) => (
            <li key={`${h.puzzleId}-${i}`}>
              <span className={h.correct ? 'ok' : 'bad'}>
                {h.correct ? '✓' : '✗'}
              </span>{' '}
              {h.date} · {h.puzzleId} ·{' '}
              {h.motifs.map((m) => MOTIF_LABELS[m]).join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
