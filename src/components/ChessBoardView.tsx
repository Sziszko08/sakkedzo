import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';
import { sideToMove } from '../utils/chessHelpers';

interface Props {
  fen: string;
  orientation: 'white' | 'black';
  interactive: boolean;
  onMove: (from: string, to: string, promotion?: string) => boolean;
  boardId?: string;
  /** Highlight the last move (from/to squares). */
  lastMove?: { from: string; to: string } | null;
  animationDurationInMs?: number;
  /** Amber/blue highlight while revealing the solution after a fail. */
  correctionHighlight?: boolean;
  /** Show a high-visibility „HIBÁS” chip over the board. */
  failOverlay?: boolean;
  /** Show amber „Megoldás” chip while the correct line is played. */
  solutionOverlay?: boolean;
  /** Brief red flash on attempted wrong-move squares. */
  flashSquares?: { from: string; to: string } | null;
  /** Optional remount key (puzzle change / boardKey). Must NOT include fen — position updates via options. */
  forceRemountKey?: string;
}

/** Auto-queen only when the moving piece is actually a pawn. */
function maybePromotion(fen: string, from: string, to: string): string | undefined {
  const fromSq = from.toLowerCase();
  const toSq = to.toLowerCase();
  if (
    (toSq[1] === '8' || toSq[1] === '1') &&
    (fromSq[1] === '7' || fromSq[1] === '2')
  ) {
    try {
      const chess = new Chess(fen);
      const piece = chess.get(fromSq as Square);
      if (piece?.type === 'p') return 'q';
    } catch {
      // ignore
    }
  }
  return undefined;
}

/** react-chessboard pieceType is e.g. wP / bN — first char is side. */
function pieceSide(pieceType: string | undefined | null): 'w' | 'b' | null {
  if (!pieceType) return null;
  const c = pieceType[0]?.toLowerCase();
  return c === 'w' || c === 'b' ? c : null;
}

function pieceOnSquareMatchesSide(fen: string, square: string, stm: 'w' | 'b'): boolean {
  try {
    const chess = new Chess(fen);
    const piece = chess.get(square.toLowerCase() as Square);
    return !!piece && piece.color === stm;
  } catch {
    return false;
  }
}

export function ChessBoardView({
  fen,
  orientation,
  interactive,
  onMove,
  boardId = 'main',
  lastMove = null,
  animationDurationInMs = 180,
  correctionHighlight = false,
  failOverlay = false,
  solutionOverlay = false,
  flashSquares = null,
  forceRemountKey,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  /** Prevents onSquareClick + onPieceClick from both applying the same gesture. */
  const moveLockRef = useRef(false);

  const stm = useMemo(() => sideToMove(fen), [fen]);

  useEffect(() => {
    setSelected(null);
  }, [fen]);

  // Prevent accidental page scroll/zoom while interacting with the board
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const block = (e: Event) => {
      if (e.cancelable) e.preventDefault();
    };

    el.addEventListener('touchmove', block, { passive: false });
    el.addEventListener('gesturestart', block as EventListener, { passive: false });
    return () => {
      el.removeEventListener('touchmove', block);
      el.removeEventListener('gesturestart', block as EventListener);
    };
  }, [fen, boardId]);

  const tryMove = useCallback(
    (from: string, to: string) => {
      if (moveLockRef.current) return false;
      // Only the side to move may move pieces
      if (!pieceOnSquareMatchesSide(fen, from, stm)) {
        setSelected(null);
        return false;
      }
      moveLockRef.current = true;
      window.setTimeout(() => {
        moveLockRef.current = false;
      }, 160);
      const ok = onMove(from, to, maybePromotion(fen, from, to));
      setSelected(null);
      return ok;
    },
    [onMove, fen, stm],
  );

  const selectIfOwn = useCallback(
    (square: string, pieceType?: string | null) => {
      const side = pieceSide(pieceType) ?? (pieceOnSquareMatchesSide(fen, square, stm) ? stm : null);
      if (side === stm) {
        setSelected(square);
        return true;
      }
      setSelected(null);
      return false;
    },
    [fen, stm],
  );

  const options = useMemo(() => {
    const squareStyles: Record<string, CSSProperties> = {};
    if (flashSquares) {
      squareStyles[flashSquares.from] = {
        backgroundColor: 'rgba(229, 57, 53, 0.65)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 82, 82, 0.95)',
      };
      squareStyles[flashSquares.to] = {
        backgroundColor: 'rgba(229, 57, 53, 0.75)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 82, 82, 0.95)',
      };
    }
    if (lastMove) {
      if (correctionHighlight) {
        // Amber from + blue to — solution reveal after failure (never green/"success")
        squareStyles[lastMove.from] = {
          backgroundColor: 'rgba(255, 167, 38, 0.55)',
        };
        squareStyles[lastMove.to] = {
          backgroundColor: 'rgba(79, 195, 247, 0.70)',
        };
      } else {
        squareStyles[lastMove.from] = {
          backgroundColor: 'rgba(246, 196, 69, 0.55)',
        };
        squareStyles[lastMove.to] = {
          backgroundColor: 'rgba(246, 196, 69, 0.75)',
        };
      }
    }
    if (selected) {
      squareStyles[selected] = {
        backgroundColor: 'rgba(255, 213, 79, 0.55)',
      };
    }

    return {
      id: boardId,
      position: fen,
      boardOrientation: orientation,
      allowDragging: interactive,
      canDragPiece: ({ piece }: { piece: { pieceType: string }; isSparePiece: boolean; square: string | null }) => {
        if (!interactive) return false;
        return pieceSide(piece.pieceType) === stm;
      },
      showNotation: true,
      animationDurationInMs,
      squareStyles,
      boardStyle: {
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '100%',
        margin: '0 auto',
        borderRadius: '8px',
        overflow: 'hidden' as const,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        touchAction: 'none',
      },
      lightSquareStyle: { backgroundColor: '#eee6c9' },
      darkSquareStyle: { backgroundColor: '#6a994e' },
      onPieceDrop: ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
        if (!interactive || !targetSquare) return false;
        if (!pieceOnSquareMatchesSide(fen, sourceSquare, stm)) return false;
        return tryMove(sourceSquare, targetSquare);
      },
      onSquareClick: ({ square, piece }: SquareHandlerArgs) => {
        if (!interactive) return;
        if (!selected) {
          selectIfOwn(square, piece?.pieceType);
          return;
        }
        if (selected === square) {
          setSelected(null);
          return;
        }
        // Click another own piece → switch selection instead of attempting a move
        const clickSide = pieceSide(piece?.pieceType);
        if (clickSide === stm) {
          setSelected(square);
          return;
        }
        tryMove(selected, square);
      },
      onPieceClick: ({ square, piece }: { square: string | null; piece?: { pieceType: string } }) => {
        if (!interactive || !square) return;
        if (!selected) {
          selectIfOwn(square, piece?.pieceType);
          return;
        }
        if (selected === square) {
          setSelected(null);
          return;
        }
        const clickSide = pieceSide(piece?.pieceType);
        if (clickSide === stm) {
          setSelected(square);
          return;
        }
        tryMove(selected, square);
      },
    };
  }, [
    fen,
    orientation,
    interactive,
    boardId,
    selected,
    tryMove,
    selectIfOwn,
    stm,
    lastMove,
    animationDurationInMs,
    correctionHighlight,
    flashSquares,
  ]);

  // Stable key: remount only when boardId / forceRemountKey changes — never on fen alone
  const remountKey = forceRemountKey ?? boardId;

  return (
    <div ref={wrapRef} className="board-wrap" role="application" aria-label="Sakkábla">
      {failOverlay && (
        <div className="board-fail-chip" aria-hidden="true">
          HIBÁS
        </div>
      )}
      {solutionOverlay && (
        <div className="board-solution-chip" aria-hidden="true">
          Megoldás
        </div>
      )}
      <Chessboard key={remountKey} options={options} />
    </div>
  );
}
