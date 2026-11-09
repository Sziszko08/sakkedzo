import type { AppStats, Motif } from '../types';
import { MOTIF_LABELS } from '../types';
import { getWeakMotifs, motifAccuracy } from '../storage';

interface Props {
  stats: AppStats;
  onExit: () => void;
  onPractice: (motifs: Motif[]) => void;
}

export function Weaknesses({ stats, onExit, onPractice }: Props) {
  const weak = getWeakMotifs(stats.motifStats, 1);
  const motifs = Object.keys(MOTIF_LABELS) as Motif[];

  const sorted = [...motifs].sort((a, b) => {
    const aa = motifAccuracy(stats.motifStats[a]);
    const ba = motifAccuracy(stats.motifStats[b]);
    const at =
      stats.motifStats[a].correct + stats.motifStats[a].incorrect;
    const bt =
      stats.motifStats[b].correct + stats.motifStats[b].incorrect;
    if (at === 0 && bt === 0) return 0;
    if (at === 0) return 1;
    if (bt === 0) return -1;
    return aa - ba;
  });

  return (
    <div className="panel">
      <div className="session-top">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Menü
        </button>
        <h2>Gyenge pontok</h2>
        <span />
      </div>

      <p className="muted">
        Az alacsonyabb pontosságú motívumok előre kerülnek. Gyakorolj célzottan!
      </p>

      {sorted.every(
        (m) =>
          stats.motifStats[m].correct + stats.motifStats[m].incorrect === 0,
      ) ? (
        <p className="empty">
          Még nincs elég adat. Oldj meg néhány feladatot a napi edzésben vagy a
          taktikai gyakorlásban!
        </p>
      ) : (
        <ul className="weak-list">
          {sorted.map((m) => {
            const s = stats.motifStats[m];
            const attempts = s.correct + s.incorrect;
            const acc = Math.round(motifAccuracy(s) * 100);
            const isWeak = weak.includes(m) && attempts > 0 && acc < 70;
            return (
              <li key={m} className={isWeak ? 'weak-item weak' : 'weak-item'}>
                <div>
                  <strong>{MOTIF_LABELS[m]}</strong>
                  <div className="muted small">
                    {attempts === 0
                      ? 'Még nem gyakoroltad'
                      : `${acc}% pontosság · ${attempts} kísérlet`}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onPractice([m])}
                >
                  Gyakorlás
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {weak.length > 0 && (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => onPractice(weak.slice(0, 3))}
        >
          Gyenge pontok vegyes gyakorlása
        </button>
      )}
    </div>
  );
}
