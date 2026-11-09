import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoardView } from './ChessBoardView';
import { Clock } from './Clock';
import type { AppStats, Difficulty, Motif, Puzzle } from '../types';
import { DIFFICULTY_LABELS, MOTIF_LABELS } from '../types';
import {
  applyUci,
  movesEqualUci,
  orientationFromFen,
  parseUci,
} from '../utils/chessHelpers';

type Status = 'playing' | 'correct' | 'wrong' | 'timeout' | 'done';

interface CorrectionStep {
  fen: string;
  from: string;
  to: string;
}

interface Props {
  title: string;
  puzzles: Puzzle[];
  mode: 'daily' | 'tactics';
  stats: AppStats;
  onResult: (
    puzzleId: string,
    correct: boolean,
    motifs: Motif[],
    difficulty: Difficulty,
    mode: 'daily' | 'tactics',
  ) => void;
  onExit: () => void;
  completedIds?: string[];
}

/** Delay between successive correction plies AFTER the first immediate reveal. */
const REPLAY_STEP_MS = 400;

function solutionToSan(fen: string, solution: string[]): string {
  const c = new Chess(fen);
  const sans: string[] = [];
  for (const u of solution) {
    const { from, to, promotion } = parseUci(u);
    try {
      const m = c.move({
        from,
        to,
        promotion: (promotion as 'q' | 'r' | 'b' | 'n') || undefined,
      });
      if (m) sans.push(m.san);
    } catch {
      // skip invalid
    }
  }
  return sans.join(', ');
}

function firstMoveSan(fen: string, uci: string | undefined): string {
  if (!uci) return '';
  const c = new Chess(fen);
  const { from, to, promotion } = parseUci(uci);
  try {
    const m = c.move({
      from,
      to,
      promotion: (promotion as 'q' | 'r' | 'b' | 'n') || undefined,
    });
    return m?.san ?? uci;
  } catch {
    return uci;
  }
}

function buildCorrectionSteps(
  fromFen: string,
  remaining: string[],
): CorrectionStep[] {
  const steps: CorrectionStep[] = [];
  const c = new Chess(fromFen);
  for (const u of remaining) {
    const { from, to, promotion } = parseUci(u);
    try {
      const m = c.move({
        from,
        to,
        promotion: (promotion as 'q' | 'r' | 'b' | 'n') || undefined,
      });
      if (m) steps.push({ fen: c.fen(), from, to });
    } catch {
      // skip broken ply
    }
  }
  return steps;
}

export function PuzzleSession({
  title,
  puzzles,
  mode,
  onResult,
  onExit,
  completedIds = [],
}: Props) {
  const queue = useMemo(() => {
    if (mode !== 'daily') return puzzles;
    return puzzles.filter((p) => !completedIds.includes(p.id));
  }, [puzzles, mode, completedIds]);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>('playing');
  const [moveIndex, setMoveIndex] = useState(0);
  const [fen, setFen] = useState(queue[0]?.fen ?? '');
  const [clockOn, setClockOn] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTried, setSessionTried] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [solutionLine, setSolutionLine] = useState('');
  const [correctMoveLabel, setCorrectMoveLabel] = useState('');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [boardKey, setBoardKey] = useState(0);
  /** State-driven solution replay — one step applied per effect tick. */
  const [correctionQueue, setCorrectionQueue] = useState<CorrectionStep[]>([]);
  /** Brief red flash on the squares the user tried. */
  const [flashSquares, setFlashSquares] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const statusRef = useRef<Status>(status);
  statusRef.current = status;
  /**
   * Scoring lock: once a wrong/timeout happens this attempt, NEVER call
   * finishCorrect / onResult(..., true) until resetPuzzle clears it.
   */
  const failedThisPuzzleRef = useRef(false);

  const puzzle = queue[index];

  const resetPuzzle = useCallback((p: Puzzle | undefined) => {
    failedThisPuzzleRef.current = false;
    setCorrectionQueue([]);
    setFlashSquares(null);
    if (!p) {
      setStatus('done');
      return;
    }
    setFen(p.fen);
    setMoveIndex(0);
    setStatus('playing');
    setFeedback('');
    setSolutionLine('');
    setCorrectMoveLabel('');
    setLastMove(null);
    setBoardKey((k) => k + 1);
  }, []);

  useEffect(() => {
    resetPuzzle(puzzle);
  }, [puzzle, resetPuzzle]);

  // Clear flash after a short beat
  useEffect(() => {
    if (!flashSquares) return;
    const id = window.setTimeout(() => setFlashSquares(null), 320);
    return () => window.clearTimeout(id);
  }, [flashSquares]);

  /**
   * Animate remaining correction plies (steps after the immediate first).
   * Only updates fen + lastMove — never remounts the board mid-replay.
   */
  useEffect(() => {
    if (correctionQueue.length === 0) return;
    const step = correctionQueue[0];
    const id = window.setTimeout(() => {
      setFen(step.fen);
      setLastMove({ from: step.from, to: step.to });
      setFlashSquares(null);
      setCorrectionQueue((q) => q.slice(1));
    }, REPLAY_STEP_MS);
    return () => window.clearTimeout(id);
  }, [correctionQueue]);

  const orientation = useMemo(
    () => (puzzle ? orientationFromFen(puzzle.fen) : 'white'),
    [puzzle],
  );

  /**
   * Queue remaining solution plies from the *current* mid-puzzle FEN —
   * never resets to puzzle start. Board updates are driven by correctionQueue.
   */
  const startInPlaceCorrection = useCallback(
    (fromFen: string, fromMoveIndex: number, solution: string[]) => {
      const remaining = solution.slice(fromMoveIndex);
      const steps = buildCorrectionSteps(fromFen, remaining);
      setSolutionLine(solutionToSan(fromFen, remaining));
      setCorrectMoveLabel(firstMoveSan(fromFen, remaining[0]));

      if (steps.length === 0) {
        // Still show SAN text; board stays at pre-wrong ply FEN
        setFen(fromFen);
        setLastMove(null);
        setCorrectionQueue([]);
        return;
      }

      const [first, ...rest] = steps;
      // Apply first correct ply immediately (rAF: after chessboard snap-back, ≤1 frame)
      const applyFirst = () => {
        setFen(first.fen);
        setLastMove({ from: first.from, to: first.to });
        setFlashSquares(null);
        setCorrectionQueue(rest);
      };
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(applyFirst);
      } else {
        applyFirst();
      }
    },
    [],
  );

  const finishWrong = useCallback(
    (
      reason: 'wrong' | 'timeout',
      plyFen: string,
      plyMoveIndex: number,
      attempted?: { from: string; to: string },
    ) => {
      if (!puzzle || statusRef.current !== 'playing') return;
      failedThisPuzzleRef.current = true;
      statusRef.current = reason;
      setStatus(reason);
      setFeedback(puzzle.magyarazat);
      setSessionTried((n) => n + 1);
      onResult(puzzle.id, false, puzzle.motifs, puzzle.difficulty, mode);
      if (attempted) setFlashSquares(attempted);
      startInPlaceCorrection(plyFen, plyMoveIndex, puzzle.solution);
    },
    [puzzle, onResult, mode, startInPlaceCorrection],
  );

  const finishCorrect = useCallback(() => {
    if (!puzzle) return;
    // Scoring lock: never credit success after a fail on this attempt
    if (failedThisPuzzleRef.current) return;
    if (statusRef.current !== 'playing') return;
    statusRef.current = 'correct';
    setStatus('correct');
    setFeedback(puzzle.magyarazat);
    setSolutionLine(solutionToSan(puzzle.fen, puzzle.solution));
    setCorrectMoveLabel('');
    setSessionTried((n) => n + 1);
    setSessionCorrect((n) => n + 1);
    onResult(puzzle.id, true, puzzle.motifs, puzzle.difficulty, mode);
  }, [puzzle, onResult, mode]);

  const handleMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!puzzle || statusRef.current !== 'playing') return false;
      if (failedThisPuzzleRef.current) return false;
      const expected = puzzle.solution[moveIndex];
      if (!expected) return false;

      // Ignore gestures on the wrong colour (do not score as wrong)
      try {
        const probe = new Chess(fen);
        const piece = probe.get(from.toLowerCase() as 'a1');
        const stm = fen.split(' ')[1];
        if (!piece || piece.color !== stm) return false;
      } catch {
        return false;
      }

      if (!movesEqualUci(from, to, promotion, expected, fen)) {
        // Snap piece back (return false) and correct in place from this ply.
        const plyFen = fen;
        const plyIdx = moveIndex;
        finishWrong('wrong', plyFen, plyIdx, { from, to });
        return false;
      }

      const c = new Chess(fen);
      const { from: f, to: t, promotion: p } = parseUci(expected);
      try {
        const m = c.move({
          from: f,
          to: t,
          promotion: (p as 'q') || (promotion as 'q') || undefined,
        });
        if (m) setLastMove({ from: f, to: t });
      } catch {
        finishWrong('wrong', fen, moveIndex, { from, to });
        return false;
      }

      let nextIdx = moveIndex + 1;
      // auto-play opponent reply if any
      if (nextIdx < puzzle.solution.length) {
        const reply = puzzle.solution[nextIdx];
        if (applyUci(c, reply)) {
          const { from: rf, to: rt } = parseUci(reply);
          setLastMove({ from: rf, to: rt });
          nextIdx += 1;
        }
      }

      setFen(c.fen());
      setMoveIndex(nextIdx);

      if (nextIdx >= puzzle.solution.length) {
        finishCorrect();
      }
      return true;
    },
    [puzzle, moveIndex, fen, finishWrong, finishCorrect],
  );

  const goNext = () => {
    setCorrectionQueue([]);
    setFlashSquares(null);
    if (index + 1 >= queue.length) {
      setStatus('done');
      return;
    }
    setIndex((i) => i + 1);
  };

  const retry = () => {
    resetPuzzle(puzzle);
  };

  if (!puzzle && status !== 'done') {
    return (
      <div className="panel">
        <h2>{title}</h2>
        <p className="empty">Nincs több feladat mára. Gratulálunk!</p>
        <button type="button" className="btn btn-primary" onClick={onExit}>
          Vissza a főmenübe
        </button>
      </div>
    );
  }

  if (status === 'done' || (!puzzle && queue.length === 0)) {
    return (
      <div className="panel">
        <h2>Edzés kész!</h2>
        <p>
          Eredmény: <strong>{sessionCorrect}</strong> / {sessionTried} helyes
        </p>
        <p className="muted">
          {sessionTried === 0
            ? 'Ma már teljesítetted a napi feladatokat.'
            : 'Szép munka — nézd meg a gyenge pontokat és a statisztikákat!'}
        </p>
        <button type="button" className="btn btn-primary" onClick={onExit}>
          Vissza a főmenübe
        </button>
      </div>
    );
  }

  const correcting = status === 'wrong' || status === 'timeout';
  const revealingSolution = correcting && lastMove !== null;

  return (
    <div className="panel puzzle-session">
      <div className="session-top">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Menü
        </button>
        <h2>{title}</h2>
        <div className="session-meta">
          {index + 1}/{queue.length}
        </div>
      </div>

      <div className="tags">
        {puzzle.motifs.map((m) => (
          <span key={m} className="tag">
            {MOTIF_LABELS[m]}
          </span>
        ))}
        <span className="tag tag-diff">{DIFFICULTY_LABELS[puzzle.difficulty]}</span>
      </div>

      <div className="toolbar">
        <label className="toggle">
          <input
            type="checkbox"
            checked={clockOn}
            onChange={(e) => setClockOn(e.target.checked)}
          />
          Óra (90 mp)
        </label>
        <Clock
          enabled={clockOn}
          seconds={90}
          running={status === 'playing'}
          onExpire={() => finishWrong('timeout', fen, moveIndex)}
          resetKey={`${puzzle.id}-${status === 'playing' ? 'p' : 'x'}-${index}`}
        />
      </div>

      <p className="side-hint">
        {orientation === 'white' ? 'Világos lép' : 'Sötét lép'} — keresd a legjobb
        folytatást!
      </p>

      {correcting && (
        <div className="fail-banner" role="alert">
          <strong>Hibás lépés</strong>
          <span>
            {status === 'timeout'
              ? ' — lejárt az idő; a helyes megoldás megjelenik'
              : correctMoveLabel
                ? ` — a helyes lépés: ${correctMoveLabel}`
                : ' — itt a helyes megoldás (nem jár pontért)'}
          </span>
        </div>
      )}

      <ChessBoardView
        fen={fen}
        orientation={orientation}
        interactive={status === 'playing'}
        onMove={handleMove}
        boardId={`puzzle-${puzzle.id}-${boardKey}`}
        lastMove={lastMove}
        animationDurationInMs={correcting ? 360 : 180}
        correctionHighlight={correcting}
        failOverlay={correcting && !revealingSolution}
        solutionOverlay={revealingSolution}
        flashSquares={flashSquares}
        forceRemountKey={String(boardKey)}
      />

      {status === 'playing' && (
        <p className="muted center">
          Koppints a bábra, majd a célmezőre — vagy húzd ujjal.
        </p>
      )}

      {status === 'correct' && (
        <div className="result result-ok">
          <strong>Helyes!</strong>
          {solutionLine && (
            <p className="solution-line">Helyes: {solutionLine}</p>
          )}
          <p>{feedback}</p>
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Következő
          </button>
        </div>
      )}

      {correcting && (
        <div className="result result-bad">
          <strong>
            {status === 'timeout'
              ? 'Lejárt az idő — a helyes folytatás'
              : correctMoveLabel
                ? `Hibás — a helyes lépés: ${correctMoveLabel}`
                : 'Hibás lépés — itt a helyes megoldás'}
          </strong>
          {solutionLine && (
            <p className="solution-line solution-line--reveal">
              Folytatás (megjelenítés): {solutionLine}
            </p>
          )}
          <p>{feedback}</p>
          <div className="btn-row">
            <button type="button" className="btn" onClick={retry}>
              Újra
            </button>
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Következő
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
