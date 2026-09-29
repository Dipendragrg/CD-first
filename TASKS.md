# CD-first — Task log (updated every task, shown in site Tasks section)

This file is fetched by `index.html` → `#taskLog`, so the site, repo, and each task stay in sync.

## 2026-09-29 — Fix localhost:3000 blank page + site improvements
- **Problem:** `http://localhost:3000` showed only `CD-first server running...` text, not the game.
- **Cause:** `server.js` had `app.get('/')` text response, no `express.static`.
- **Fix:** `server.js` now uses `express.static(__dirname)` → `/` serves `index.html` + game. Text moved to `/server-info`. Health stays at `/health`.
- **Site improvements:**
  - `index.html`: added `#loading`, `#status`, `📋 Project tasks` panel (loads this file), auto-filled server URL, run hints.
  - `style.css`: styles for loading/status/tasks.
  - `client.js`: `bootUI()` hides loader, auto-fills origin, loads TASKS.md, WebGL error message, Space scroll fix, per-game `logTask()` to localStorage.
- **Verify:** `npm start` → open `http://localhost:3000` → game canvas visible → press 1P → cubes + orbs move. `/health` returns `{"ok":true}`.
- **Files:** `server.js`, `index.html`, `style.css`, `client.js`, `TASKS.md`

## 2026-09-29 — Initial game + LEARN guide
- Three.js Cube Arena: 1P vs bots, 2P local, online-ready relay.
- Files: `index.html`, `client.js`, `style.css`, `server.js`, `package.json`, `README.md`, `LEARN.md`
- Pushed `main` to `Dipendragrg/CD-first`, public.

## How to add next task (do every time)
1. Edit code, test `npm start` + `http://localhost:3000`.
2. Append new dated section here + update `#taskLog` auto-shows it.
3. Commit + push: `git add .; git commit -m "..."; git push origin main`.
