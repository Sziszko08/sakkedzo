import { useCallback, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoardView } from './ChessBoardView';

interface Props {
  onExit: () => void;
}

const START =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function FreePlay({ onExit }: Props) {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(START);
  const [fenInput, setFenInput] = useState('');
  const [fenError, setFenError] = useState('');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [history, setHistory] = useState<string[]>([]);
  const [weakOpp, setWeakOpp] = useState(false);

  const statusText = useMemo(() => {
    if (game.isCheckmate()) return 'Matt!';
    if (game.isDraw()) return 'Döntetlen';
    if (game.isCheck()) return 'Sakk!';
    return game.turn() === 'w' ? 'Világos lép' : 'Sötét lép';
  }, [game, fen]);

  const playWeakReply = useCallback((c: Chess) => {
    const moves = c.moves({ verbose: true });
    if (moves.length === 0) return;
    // prefer captures / checks randomly among legal — "weak" = random
    const pick = moves[Math.floor(Math.random() * moves.length)];
    c.move(pick);
  }, []);

  const onMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      const c = new Chess(fen);
      let move;
      try {
        move = c.move({
          from: from as 'a1',
          to: to as 'a1',
          promotion: (promotion as 'q') || undefined,
        });
      } catch {
        return false;
      }
      if (!move) return false;

      if (weakOpp && !c.isGameOver()) {
        playWeakReply(c);
      }

      setGame(c);
      setFen(c.fen());
      setHistory(c.history());
      return true;
    },
    [fen, weakOpp, playWeakReply],
  );

  const loadFen = () => {
    try {
      const c = new Chess(fenInput.trim());
      setGame(c);
      setFen(c.fen());
      setHistory(c.history());
      setOrientation(c.turn() === 'b' ? 'black' : 'white');
      setFenError('');
    } catch {
      setFenError('Érvénytelen FEN. Ellenőrizd a pozíciót.');
    }
  };

  const reset = () => {
    const c = new Chess();
    setGame(c);
    setFen(START);
    setHistory([]);
    setFenError('');
    setOrientation('white');
  };

  const undo = () => {
    const c = new Chess(fen);
    // rebuild from history minus last (and opponent if weak)
    const h = game.history();
    const drop = weakOpp ? 2 : 1;
    const c2 = new Chess();
    for (const san of h.slice(0, Math.max(0, h.length - drop))) {
      c2.move(san);
    }
    void c;
    setGame(c2);
    setFen(c2.fen());
    setHistory(c2.history());
  };

  return (
    <div className="panel">
      <div className="session-top">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Menü
        </button>
        <h2>Szabad játék</h2>
        <span />
      </div>

      <p className="status-line">{statusText}</p>

      <ChessBoardView
        fen={fen}
        orientation={orientation}
        interactive={!game.isGameOver()}
        onMove={onMove}
        boardId="freeplay"
      />

      <div className="toolbar wrap">
        <button type="button" className="btn" onClick={reset}>
          Új játszma
        </button>
        <button type="button" className="btn" onClick={undo} disabled={history.length === 0}>
          Visszavonás
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
        >
          Forgatás
        </button>
        <label className="toggle">
          <input
            type="checkbox"
            checked={weakOpp}
            onChange={(e) => setWeakOpp(e.target.checked)}
          />
          Gyenge véletlen ellenfél
        </label>
      </div>

      <div className="fen-box">
        <label htmlFor="fen">Pozíció betöltése FEN-ből</label>
        <textarea
          id="fen"
          rows={2}
          value={fenInput}
          onChange={(e) => setFenInput(e.target.value)}
          placeholder="Illeszd be a FEN-t…"
        />
        {fenError && <p className="error">{fenError}</p>}
        <button type="button" className="btn btn-primary" onClick={loadFen}>
          Betöltés
        </button>
      </div>

      <div className="moves-box">
        <h3>Lépések</h3>
        <p className="moves">{history.length ? history.join(' ') : 'Még nincs lépés.'}</p>
      </div>
    </div>
  );
}
