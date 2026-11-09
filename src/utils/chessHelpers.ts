import { Chess, type Square } from 'chess.js';

/** UCI pl. e2e4 vagy e7e8q */
export function parseUci(uci: string): {
  from: Square;
  to: Square;
  promotion?: string;
} {
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.length > 4 ? uci[4] : undefined;
  return { from, to, promotion };
}

/**
 * Strict UCI compare: lowercase squares, exact from+to.
 * Auto-accept missing promotion as queen ONLY when the piece on `from` is a pawn.
 */
export function movesEqualUci(
  from: string,
  to: string,
  promotion: string | undefined,
  expectedUci: string,
  fen: string,
): boolean {
  const fromSq = from.toLowerCase();
  const toSq = to.toLowerCase();
  const exp = expectedUci.toLowerCase();
  const expFrom = exp.slice(0, 2);
  const expTo = exp.slice(2, 4);
  const expPromo = exp.length > 4 ? exp[4] : undefined;
  const gotPromo = promotion ? promotion.toLowerCase() : undefined;

  if (fromSq !== expFrom || toSq !== expTo) return false;

  if (gotPromo === expPromo) return true;
  if (!gotPromo && !expPromo) return true;

  // Allow auto-q only for pawns when the expected move promotes to queen
  if (!gotPromo && expPromo === 'q') {
    try {
      const chess = new Chess(fen);
      const piece = chess.get(fromSq as Square);
      return piece?.type === 'p';
    } catch {
      return false;
    }
  }

  return false;
}

export function applyUci(chess: Chess, uci: string): boolean {
  try {
    const { from, to, promotion } = parseUci(uci);
    const move = chess.move({
      from,
      to,
      promotion: (promotion as 'q' | 'r' | 'b' | 'n') || undefined,
    });
    return !!move;
  } catch {
    return false;
  }
}

export function sideToMove(fen: string): 'w' | 'b' {
  return fen.split(' ')[1] as 'w' | 'b';
}

export function orientationFromFen(fen: string): 'white' | 'black' {
  return sideToMove(fen) === 'b' ? 'black' : 'white';
}

/** Determinisztikus napi seed a dátumból */
export function dateSeed(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) {
    h = (h * 31 + date.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
