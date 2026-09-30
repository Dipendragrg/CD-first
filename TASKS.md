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

## 2026-09-30 — Solver Lab: instructions + code editor + bot verdict
- New `#solve` section: task picker (6 tasks: HTML×2, CSS×2, JS×2), steps, HTML/CSS/JS tabs, Run preview (iframe), Check bot verdict ✅/❌ per check, Reset.
- `solver.js` (new, repo-tracked): static + LIVE checks (bot really clicks your counter/todo in the preview), hints, helper bot KB (flex, center, media, click, null, img, form, localStorage, loop, iframe), solved tasks auto-award Levels XP (same localStorage).
- Portfolio wires `CDSolver.init`; game/levels/submit untouched. Checker regexes unit-tested (7/7 pass).
- Files: `CD-first/solver.js`, portfolio `index.html` (local-only).

## 2026-09-30 — Typing Lab replaces game + voice bot + autocomplete + path locks + Python
- `#typing` Typing Lab replaces game embed (game kept fullscreen): Easy/Medium/Hard paragraphs, live WPM/accuracy/char paint, best per difficulty.
- Voice: 🎤 mic input (SpeechRecognition, Chrome/Edge) + 🔊 spoken bot replies (speechSynthesis toggle) via `voice.js`.
- VS Code-style hints: `autocomplete.js` popup w/ docs, Tab/Enter accept, arrows, Esc — HTML/CSS/JS/Python editors.
- Guided path, no confusion: HTML → CSS → JS → Python unlock in order (🔒 in picker + stepper), game track open; bot explains locked levels.
- Python track: 3 solver tasks executed live via Pyodide CDN (lazy, offline fallback to static checks) + 5 Levels tasks + submit filter/option.
- Files: `typing.js`, `voice.js`, `autocomplete.js`, `solver.js`, `levels-submit.js`, portfolio `index.html` (local-only).

## 2026-09-30 — Learn section + earned ticks (no free checkboxes)
- New `#learn` section (`lessons.js`): 9 beginner lessons incl. how-code-runs, CSS-connect bridge, JS-alive, Python, game-play. Each: Read + Practice → (solver/typing/submit/game) + manual ✓ ticks.
- Levels ticks are now EARNED: rows show ✅/⬜ status + Learn / Code ▸ buttons; clicking opens lesson or Solver (`CDSolver.openLevel`); solver success live-refreshes Levels (`CDLevels.refresh`, no reload).
- Typing adds Code mode (real snippets as practice material).
- Verified: syntax all OK, module smoke 10/10, server serves learn+solver+typing, files ≤500 lines.
- Files: `lessons.js`, `levels-submit.js`, `solver.js`, `typing.js`, portfolio `index.html` (local-only).

## 2026-09-30 — De-AI pass + beginner audit
- Online check: repo public, 11 commits, all files live; Pages NOT enabled (404) → enable in Settings → Pages → main/(root).
- Full audit script: 13 anchors, 6 scripts, 25 lesson mappings, 9 solver↔levels links, 47 wiring ids — ALL GREEN.
- Human voice: real hero (class 12, mornings, cricket), honest About, 3 real projects (arena/solversite/diary), dead social links replaced, personal footer.
- Beginner: lesson-1 practice button (typing), readable inline code style, "now" line points to lesson 1.
- Files: `lessons.js`, portfolio `index.html` (local-only).

## 2026-09-30 — Removed Cube Arena
- Deleted game page + engine (`CD-first/index.html`, `client.js`, `style.css`); site is now typing + solver + levels only.
- Cleaned all live refs: Levels tracks (HTML/CSS/JS/Python), lessons, solver bot example, package description, server messages. History docs untouched.
- Typing Hub is the fullscreen practice page; socket relay kept in server for later.

## 2026-09-30 — Project builds + UI/UX studio + runs on any computer
- `projects.js`: 4 guided builds (scoreboard table, card grid, validated form, bill splitter) plugged into Solver via `addTasks`; XP + locks included.
- `#design` UI/UX Studio (`design.js`): theme knobs + live preview + copyable CSS, WCAG contrast checker, 5 designer rules.
- Portable: portfolio moved INTO the repo (`index.html`), server serves its own folder + prints LAN URL for other computers/phones; README rewritten as any-computer setup; LEARN.md rewritten as file map.
- Files: `projects.js`, `design.js`, `index.html`, `server.js`, `README.md`, `LEARN.md`.

## 2026-09-30 — Thinking bot + learner-first + clearer tasks
- `brain.js`: analyzes YOUR code (missing alt, unclosed tags, dead buttons, no print, tabs), builds numbered fix plans, defines 40+ terms with examples, explains WHY each rule is correct, admits what it doesn't know. 9/9 tested.
- Solver verdicts now show "Why it matters" under the first ❌; ask box routes through the brain (voice still speaks replies).
- Learner framing: Hire Me → Ask a Doubt, Contact → Ask anything!/Community; site is for learners, not clients.
- All 13 task briefs/steps rewritten in plain words (no jargon, each step says what + where).
- Files: `brain.js`, `solver.js`, `projects.js`, `index.html`.

## 2026-09-29 — Initial game + LEARN guide
- Three.js Cube Arena: 1P vs bots, 2P local, online-ready relay.
- Files: `index.html`, `client.js`, `style.css`, `server.js`, `package.json`, `README.md`, `LEARN.md`
- Pushed `main` to `Dipendragrg/CD-first`, public.

## How to add next task (do every time)
1. Edit code, test `npm start` + `http://localhost:3000`.
2. Append new dated section here + update `#taskLog` auto-shows it.
3. Commit + push: `git add .; git commit -m "..."; git push origin main`.
