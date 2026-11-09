import type { Puzzle } from '../types';

/**
 * Kurált taktikai feladatok 1000–1500 Elo szinthez.
 * solution: UCI lépéssorozat (játékos + ellenfél válaszok felváltva).
 */
export const PUZZLES: Puzzle[] = [
  // ——— VILLA (fork) ———
  {
    id: 'v01',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: ['h5f7'],
    motifs: ['villa', 'mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Vezérvillával ütsz f7-re: matt a király ellen, és a királyi bástya is veszélyben van. Klasszikus „iskolás matt” minta.',
  },
  {
    id: 'v02',
    fen: '2r3k1/pp3ppp/8/3n4/8/8/PPP2PPP/2KR4 b - - 0 1',
    solution: ['d5e3'],
    motifs: ['villa'],
    difficulty: 'easy',
    magyarazat: 'A huszár e3-ra lép: egyszerre támadja a királyt és a d1-es bástyát. Villagyőzelem!',
  },
  {
    id: 'v03',
    fen: 'r2qkb1r/pp2pppp/2n2n2/3p1b2/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 2 7',
    solution: ['e2b5'],
    motifs: ['villa', 'kotes'],
    difficulty: 'medium',
    magyarazat: 'Futó b5-re: kötés a huszáron, és nyomás a c6–e8 vonalon. Fejlődés + taktika.',
  },
  {
    id: 'v04',
    fen: '6k1/5ppp/8/8/1n6/8/5PPP/2R3K1 b - - 0 1',
    solution: ['b4d3'],
    motifs: ['villa'],
    difficulty: 'easy',
    magyarazat: 'Huszárvilla: d3-ról a király és a bástya egyszerre van támadva.',
  },
  {
    id: 'v05',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    solution: ['f3e5', 'c6e5', 'd1h5'],
    motifs: ['villa', 'kettos_tamadas'],
    difficulty: 'hard',
    magyarazat: 'Először huszárral ütsz e5-ön, majd a vezér h5-ön villázza a királyt és az e5-ös figurát.',
  },
  {
    id: 'v06',
    fen: '3r2k1/ppp2ppp/8/8/8/2N5/PPP2PPP/3R2K1 w - - 0 1',
    solution: ['c3d5'],
    motifs: ['villa'],
    difficulty: 'easy',
    magyarazat: 'Huszár d5-re: támadja a bástyát és a gyenge pontokat. Erős központi villa-fenyegetés.',
  },
  {
    id: 'v07',
    fen: 'r4rk1/pp3ppp/2n5/3p4/3P4/2N5/PP3PPP/R3K2R w KQ - 0 1',
    solution: ['c3d5'],
    motifs: ['villa'],
    difficulty: 'medium',
    magyarazat: 'A huszár d5-re ugrik: több célpontot támad egyszerre a nyílt állásban.',
  },
  {
    id: 'v08',
    fen: '6k1/5p1p/6p1/8/8/5N2/5PPP/6K1 w - - 0 1',
    solution: ['f3e5'],
    motifs: ['villa'],
    difficulty: 'easy',
    magyarazat: 'Huszár e5-re: a gyenge sötét mezőket és a gyalogstruktúrát célozza.',
  },

  // ——— KÖTÉS (pin) ———
  {
    id: 'k01',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['f3g5'],
    motifs: ['kotes'],
    difficulty: 'easy',
    magyarazat: 'Huszár g5-re: nyomás f7-re, és a futóval együtt kötésszerű fenyegetés a király szárnyán.',
  },
  {
    id: 'k02',
    fen: 'rnbqk2r/ppp2ppp/3b1n2/3p4/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 2 6',
    solution: ['c1g5'],
    motifs: ['kotes'],
    difficulty: 'easy',
    magyarazat: 'Futó g5-re köti a huszárt a vezérhez. Klasszikus abszolút/relatív kötés.',
  },
  {
    id: 'k03',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7',
    solution: ['c1g5'],
    motifs: ['kotes'],
    difficulty: 'easy',
    magyarazat: 'Újabb g5-ös kötés: a huszár nem mozoghat szabadon a vezér mögött.',
  },
  {
    id: 'k04',
    fen: '2rq1rk1/pp1bpppp/2np1n2/8/2BNP3/2N5/PPP2PPP/R1BQ1RK1 w - - 0 1',
    solution: ['c4f7', 'f8f7', 'c3d5'],
    motifs: ['kotes', 'villa'],
    difficulty: 'hard',
    magyarazat: 'Futóáldozat f7-en, majd huszárvilla d5-ön. A kötött/gyenge f-vonalat használod ki.',
  },
  {
    id: 'k05',
    fen: 'r2qk2r/ppp2ppp/2n1bn2/3p4/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1',
    solution: ['f3g5'],
    motifs: ['kotes'],
    difficulty: 'medium',
    magyarazat: 'Huszár g5: nyomás az e6 futón és a királyszárnyon – kötés jellegű nyomás.',
  },
  {
    id: 'k06',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 6',
    solution: ['c3d5'],
    motifs: ['kotes', 'kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'A g5-ös futó köti az f6 huszárt a vezérhez. Nd5: ráteszed a nyomást a kötött huszárra (és c7/f6 veszélyben van).',
  },
  {
    id: 'k07',
    fen: 'r1bqk2r/pp1p1ppp/2n1pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5',
    solution: ['d1a4'],
    motifs: ['kotes'],
    difficulty: 'medium',
    magyarazat: 'Vezér a4-re: kötés a futón a c6 huszár/király irányában. Tipikus Nimzo-minta.',
  },
  {
    id: 'k08',
    fen: '2kr3r/ppp2ppp/2n5/3q4/8/2N5/PPP2PPP/R2QK2R w KQ - 0 1',
    solution: ['c3b5'],
    motifs: ['kotes', 'villa'],
    difficulty: 'medium',
    magyarazat: 'Huszár b5: erős nyomás a c7/a7 pontokra és a király ellen.',
  },

  // ——— NYÁRS (skewer) ———
  {
    id: 'n01',
    fen: '8/8/8/4k3/8/8/4R3/4K3 w - - 0 1',
    solution: ['e2e5'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Bástyanyárs: a király mögött álló értékek (vagy a király pozíciója) miatt a királynak el kell mozdulnia.',
  },
  {
    id: 'n02',
    fen: '4q3/8/8/4k3/8/8/4R3/4K3 w - - 0 1',
    solution: ['e2e5'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Klasszikus nyárs: a bástya a király mögötti vezért támadja – a király lépése után a vezér elvész.',
  },
  {
    id: 'n03',
    fen: '8/5k2/8/8/8/8/1q3R2/4K3 w - - 0 1',
    solution: ['f2f7'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Bástya f7-re: nyárs a királyon keresztül a vezér felé.',
  },
  {
    id: 'n04',
    fen: '8/8/8/2k5/8/8/2q1R3/4K3 w - - 0 1',
    solution: ['e2c2'],
    motifs: ['nyars', 'kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Bástya üti a vezért, miközben a király is sakkban van vagy fedetlen.',
  },
  {
    id: 'n05',
    fen: '6k1/6pp/8/8/8/8/4R1PP/6K1 w - - 0 1',
    solution: ['e2e8'],
    motifs: ['nyars', 'mattkepek'],
    difficulty: 'medium',
    magyarazat: 'Hátsó soros nyárs/mattfenyegetés: a bástya e8-ra megy a király mögé.',
  },
  {
    id: 'n06',
    fen: '8/8/3k4/8/8/3q4/3R4/3K4 w - - 0 1',
    solution: ['d2d3'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Függőleges nyárs a d-vonalon: király és vezér egy vonalon.',
  },
  {
    id: 'n07',
    fen: '4q3/4k3/8/8/8/8/7R/4K3 w - - 0 1',
    solution: ['h2e2'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Nyárs az e-vonalon: Re2+ után a király elmozdul, a vezér elesik.',
  },

  // ——— KETTŐS TÁMADÁS ———
  {
    id: 'kt01',
    fen: 'r2qk2r/ppp2ppp/2n1b3/3np3/2BP4/5N2/PPP2PPP/RNBQK2R w KQkq - 0 1',
    solution: ['c4d5'],
    motifs: ['kettos_tamadas'],
    difficulty: 'easy',
    magyarazat: 'Futó üt d5-ön: több célpontot (huszár/központ) támad egyszerre.',
  },
  {
    id: 'kt02',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 5',
    solution: ['f6e4'],
    motifs: ['kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Huszár üt e4: kettős nyomás a központra és a futóra.',
  },
  {
    id: 'kt03',
    fen: '2rq1rk1/pp1b1ppp/2n1pn2/3p4/3P4/2NB1N2/PP2QPPP/R1B2RK1 w - - 0 1',
    solution: ['d3h7', 'g8h7', 'f3g5', 'h7g8', 'e2h5'],
    motifs: ['kettos_tamadas', 'mattkepek'],
    difficulty: 'hard',
    magyarazat: 'Görög áldozat minta: futóáldozat h7-en, majd huszár g5 és vezér h5 – kettős támadás a király ellen.',
  },
  {
    id: 'kt04',
    fen: 'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5',
    solution: ['c4d5'],
    motifs: ['kettos_tamadas'],
    difficulty: 'easy',
    magyarazat: 'Ütés d5-ön: megnyitod a középet és több figurát aktiválsz egyszerre.',
  },
  {
    id: 'kt05',
    fen: 'r1bq1rk1/ppp1nppp/3p1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1',
    solution: ['f3e5'],
    motifs: ['kettos_tamadas', 'villa'],
    difficulty: 'medium',
    magyarazat: 'Huszár e5: egyszerre több pontot támad a centrumban.',
  },
  {
    id: 'kt06',
    fen: '3r2k1/ppp2ppp/8/3q4/8/2N5/PPP2PPP/3R1RK1 w - - 0 1',
    solution: ['c3d5'],
    motifs: ['kettos_tamadas', 'villa'],
    difficulty: 'easy',
    magyarazat: 'Huszár üti a vezért d5-ön, miközben a bástya is célpont lehet.',
  },
  {
    id: 'kt07',
    fen: 'r4rk1/1pp2ppp/p1nq4/3p4/3P4/2N2N2/PPP2PPP/R2Q1RK1 w - - 0 1',
    solution: ['c3b5'],
    motifs: ['kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Huszár b5: támadja a vezért és a c7 gyengeséget.',
  },

  // ——— MATTKÉPEK ———
  {
    id: 'm01',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Hátsó soros matt: a bástya e8-ra lép, a királynak nincs menekülése a gyalogok miatt.',
  },
  {
    id: 'm02',
    fen: 'r5k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['a1a8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Hátsó soros matt az a-vonalon: a bástya a8-ra megy.',
  },
  {
    id: 'm03',
    fen: '5rk1/5ppp/8/8/8/8/5PPP/4RQK1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'A bástya e8-on mattot ad (vagy döntő sakkot) a hátsó soron.',
  },
  {
    id: 'm04',
    fen: '2k5/ppp5/8/8/8/8/PPP5/2KR4 w - - 0 1',
    solution: ['d1d8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Hátsó soros matt a d-vonalon a sötét király ellen.',
  },
  {
    id: 'm05',
    fen: '6k1/6pp/8/8/8/8/6PP/3R2K1 w - - 0 1',
    solution: ['d1d8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Egyszerű hátsó soros matt: Rd8#.',
  },
  {
    id: 'm06',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 3',
    solution: ['h5f7'],
    motifs: ['mattkepek', 'villa'],
    difficulty: 'easy',
    magyarazat: 'Iskolás matt: Qxf7#. A futó védi az f7 mezőt.',
  },
  {
    id: 'm07',
    fen: '6k1/5p1p/6p1/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Hátsó soros matt, a g6 gyalog sem ment meg.',
  },
  {
    id: 'm08',
    fen: '2r3k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1',
    solution: ['b1b8'],
    motifs: ['mattkepek'],
    difficulty: 'medium',
    magyarazat: 'Bástya b8: hátsó soros matt a bástya fedezete ellenére (ütés után is mattminta).',
  },
  {
    id: 'm09',
    fen: '5k2/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Vezérmatt a hátsó soron: Qe8#.',
  },
  {
    id: 'm10',
    fen: '6k1/3R1ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
    solution: ['d7d8'],
    motifs: ['mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Hátsó soros matt: a 7. soron álló bástya d8-ra lép.',
  },

  // ——— FELFEDEZett TÁMADÁS ———
  {
    id: 'f01',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['f3g5'],
    motifs: ['felfedezett_tamadas', 'kotes'],
    difficulty: 'medium',
    magyarazat: 'A huszár elmozdulásával a futó vonala megnyílik – felfedezett nyomás f7 felé.',
  },
  {
    id: 'f02',
    fen: 'r2qkb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6',
    solution: ['e4d5'],
    motifs: ['felfedezett_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Ütéssel nyitod a vonalat: a futó felfedezett támadást kap.',
  },
  {
    id: 'f03',
    fen: '2r2rk1/pp1bpppp/2nq1n2/8/2B1P3/2N2N2/PPP2PPP/R1BQ1RK1 w - - 0 1',
    solution: ['c4f7'],
    motifs: ['felfedezett_tamadas', 'mattkepek'],
    difficulty: 'hard',
    magyarazat: 'Futóáldozat f7-en: felfedezett/közvetlen támadás a király ellen.',
  },
  {
    id: 'f04',
    fen: 'r1b1kb1r/ppppqppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 5',
    solution: ['f3g5'],
    motifs: ['felfedezett_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Huszár g5: megnyílik a futó támadása, és f7 gyenge.',
  },
  {
    id: 'f05',
    fen: 'rnbqk2r/ppp2ppp/3b1n2/3p4/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 2 6',
    solution: ['c1g5'],
    motifs: ['felfedezett_tamadas', 'kotes'],
    difficulty: 'easy',
    magyarazat: 'Futó g5: kötés és felfedezett nyomás a huszár–vezér vonalon.',
  },
  {
    id: 'f06',
    fen: '3r2k1/ppp2ppp/8/8/8/2B5/PPP2PPP/3R2K1 w - - 0 1',
    solution: ['c3g7'],
    motifs: ['felfedezett_tamadas', 'mattkepek'],
    difficulty: 'medium',
    magyarazat: 'Futó üt g7: felfedezett bástyatámadás a d-vonalon / király ellen.',
  },

  // ——— ELVONÁS (deflection / decoy) ———
  {
    id: 'e01',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solution: ['d1d8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'easy',
    magyarazat: 'A bástya a 8. sorra megy: elvonja/kihasználja a király védelmét a hátsó soron.',
  },
  {
    id: 'e02',
    fen: 'r4rk1/5ppp/8/8/8/8/5PPP/R3R1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'medium',
    magyarazat: 'Bástya e8: elvonja a védőfigurát / hátsó soros mattfenyegetés.',
  },
  {
    id: 'e03',
    fen: '2r3k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1',
    solution: ['c1c8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Ütés c8-on: elvonod a védőt, és hátsó soros minta jön létre.',
  },
  {
    id: 'e04',
    fen: '5rk1/5ppp/8/8/8/5Q2/5PPP/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'medium',
    magyarazat: 'Re8: a bástya elvonja a védelmet, a vezér támogatja a mattot.',
  },
  {
    id: 'e05',
    fen: '4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Bástyacseré/ütés e8-on: elvonás után a hátsó sor gyenge.',
  },
  {
    id: 'e06',
    fen: 'r5k1/1p3ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['a1a8'],
    motifs: ['elvonás', 'mattkepek'],
    difficulty: 'easy',
    magyarazat: 'Ra8+: elvonod a királyt/védőt a hátsó soron.',
  },

  // ——— vegyes / progresszív ———
  {
    id: 'x01',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 8',
    solution: ['g5f6'],
    motifs: ['kotes', 'kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Futó üt f6: rontja a királyállást és kettős nyomást hoz létre.',
  },
  {
    id: 'x02',
    fen: '2kr3r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2QK2R w KQ - 0 1',
    solution: ['c3b5'],
    motifs: ['villa', 'kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Nb5: villa/kettős támadás a király és a gyenge pontok ellen.',
  },
  {
    id: 'x03',
    fen: '6k1/ppp2ppp/8/8/8/2N5/PPP2PPP/6K1 w - - 0 1',
    solution: ['c3d5'],
    motifs: ['villa'],
    difficulty: 'easy',
    magyarazat: 'Központi huszárugrás: több célpontot figyel egyidejűleg.',
  },
  {
    id: 'x04',
    fen: 'r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 0 1',
    solution: ['f3g5'],
    motifs: ['kotes', 'felfedezett_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Ng5: kötés és felfedezett nyomás az e6/h7 irányában.',
  },
  {
    id: 'x05',
    fen: '3r2k1/p4ppp/8/8/8/8/P4PPP/3R2K1 w - - 0 1',
    solution: ['d1d8'],
    motifs: ['mattkepek', 'elvonás'],
    difficulty: 'easy',
    magyarazat: 'Rd8+: hátsó soros matt / elvonás.',
  },
  {
    id: 'x06',
    fen: '8/5k2/8/8/8/8/5R2/4K3 w - - 0 1',
    solution: ['f2f7'],
    motifs: ['nyars'],
    difficulty: 'easy',
    magyarazat: 'Bástya f7: közvetlen sakk/nyárs a király ellen.',
  },
  {
    id: 'x07',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
    solution: ['b8c6'],
    motifs: ['kettos_tamadas'],
    difficulty: 'easy',
    magyarazat: 'Fejlődés: Nc6 védi e5-öt és nyomást tesz a központra – alap taktikai tudatosság.',
  },
  {
    id: 'x08',
    fen: '6k1/5ppp/8/2q5/8/5Q2/5PPP/6K1 w - - 0 1',
    solution: ['f3c6'],
    motifs: ['villa', 'kettos_tamadas'],
    difficulty: 'hard',
    magyarazat: 'Vezérvilla: Qc6 egyszerre támadja a királyt és a védtelen célpontokat.',
  },
  {
    id: 'x09',
    fen: '2r3k1/5ppp/8/8/8/5B2/5PPP/6K1 w - - 0 1',
    solution: ['f3d5'],
    motifs: ['villa', 'nyars'],
    difficulty: 'medium',
    magyarazat: 'Futó d5: erős átló, villa/nyárs jellegű nyomás a bástya és a király irányában.',
  },
  {
    id: 'x10',
    fen: 'r4rk1/ppp2ppp/2n5/3p4/3P4/2N5/PPP2PPP/R4RK1 w - - 0 1',
    solution: ['c3d5'],
    motifs: ['villa', 'kettos_tamadas'],
    difficulty: 'medium',
    magyarazat: 'Nd5: központi villa, több figura ellen egyszerre.',
  },
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}

export function filterPuzzles(opts: {
  motifs?: string[];
  difficulty?: string | null;
  weakBias?: string[];
}): Puzzle[] {
  let list = [...PUZZLES].filter((p) => p.solution.length > 0);
  if (opts.motifs && opts.motifs.length > 0) {
    list = list.filter((p) => p.motifs.some((m) => opts.motifs!.includes(m)));
  }
  if (opts.difficulty) {
    list = list.filter((p) => p.difficulty === opts.difficulty);
  }
  if (opts.weakBias && opts.weakBias.length > 0) {
    const weak = opts.weakBias;
    list.sort((a, b) => {
      const aw = a.motifs.some((m) => weak.includes(m)) ? 0 : 1;
      const bw = b.motifs.some((m) => weak.includes(m)) ? 0 : 1;
      return aw - bw;
    });
  }
  return list;
}
