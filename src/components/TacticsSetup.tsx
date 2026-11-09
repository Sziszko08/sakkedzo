import { useState } from 'react';
import type { Difficulty, Motif } from '../types';
import { DIFFICULTY_LABELS, MOTIF_LABELS } from '../types';

interface Props {
  onStart: (opts: {
    motifs: Motif[];
    difficulty: Difficulty | null;
  }) => void;
  onExit: () => void;
  initialMotifs?: Motif[];
}

export function TacticsSetup({ onStart, onExit, initialMotifs = [] }: Props) {
  const [motifs, setMotifs] = useState<Motif[]>(initialMotifs);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const toggle = (m: Motif) => {
    setMotifs((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  return (
    <div className="panel">
      <div className="session-top">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Menü
        </button>
        <h2>Taktikai gyakorlás</h2>
        <span />
      </div>

      <h3>Motívumok</h3>
      <div className="chip-grid">
        {(Object.keys(MOTIF_LABELS) as Motif[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`chip ${motifs.includes(m) ? 'chip-on' : ''}`}
            onClick={() => toggle(m)}
          >
            {MOTIF_LABELS[m]}
          </button>
        ))}
      </div>
      <p className="muted small">Ha semmit nem választasz, minden motívum jön.</p>

      <h3>Nehézség</h3>
      <div className="chip-grid">
        <button
          type="button"
          className={`chip ${difficulty === null ? 'chip-on' : ''}`}
          onClick={() => setDifficulty(null)}
        >
          Vegyes
        </button>
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
          <button
            key={d}
            type="button"
            className={`chip ${difficulty === d ? 'chip-on' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => onStart({ motifs, difficulty })}
      >
        Indítás
      </button>
    </div>
  );
}
