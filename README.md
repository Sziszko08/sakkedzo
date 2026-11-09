# SakkEdző

Mobilbarát sakk taktikai edzőalkalmazás (~1000–1500 Elo) — Androidra optimalizált, telepíthető PWA.

## Telepítés és futtatás

    npm install
    npm run dev

Fejlesztői szerver: http://127.0.0.1:5173

> Megjegyzés: helyi fejlesztéshez (http://localhost) a PWA telepítés általában működik Chrome-ban. Éles környezetben HTTPS szükséges a megbízható telepítéshez és a service workerhez. Részletek: docs/ANDROID.md

## Production build

    npm run build
    npm run preview

## Android: telepítés kezdőképernyőre (PWA)

Lásd: docs/ANDROID.md

## Mit tud?

- Napi edzés (10 feladat, localStorage)
- Taktikai gyakorlás
- Gyenge pontok
- Statisztikák
- Szabad játék + FEN
- Óra (90 mp)
- Magyar UI
- Érintésbarát tábla (koppintásos lépés + húzás)
- PWA (kezdőképernyő, offline app shell)

## Technológia

Vite + React + TypeScript, chess.js, react-chessboard, vite-plugin-pwa (Workbox)

## Fájlok

- src/App.tsx
- src/data/puzzles.ts
- src/components/
- src/storage.ts / src/hooks/useStats.ts
- public/pwa-*.png, vite.config.ts
- docs/ANDROID.md
