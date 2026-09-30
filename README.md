# CD-first — learn coding by building (beginner-friendly)

A single-page learning site: **Learn** lessons → **Levels** with earned ✅ → **Solver Lab** (write code, bot checks it) →
**Typing Lab** → **UI/UX Studio** → **Submit** your project. No account, no backend — progress saves in your browser.

## Run on ANY computer (5 minutes)

**You need:** Node.js 18+ ([nodejs.org](https://nodejs.org)) + a browser + internet (first load only: fonts, Python engine).

```bash
git clone https://github.com/Dipendragrg/CD-first.git
cd CD-first
npm install
npm run dev
```

Open **http://localhost:3000/** — portfolio, typing, lessons, solver, everything.
Same WiFi? The terminal prints a `http://192.168.x.x:3000/` address — open it on another
computer or phone. No Node? Just double-click **`index.html`** (Python Run needs internet).

## Where things live

```
index.html       -> the whole site (open this)
typing-hub.html  -> fullscreen typing test
server.js        -> static server + /health (node server.js)
solver.js        -> task engine: instructions, live checks, voice, autocomplete, locks
projects.js      -> 4 guided builds (table, grid, form, bill splitter)
lessons.js       -> 9 reading lessons + earned ticks
levels-submit.js -> levels XP + project showcase
typing.js        -> typing test engine (Easy/Medium/Hard/Code)
voice.js         -> mic input + spoken bot replies (Chrome/Edge)
autocomplete.js  -> VS Code-style hints while typing code
design.js        -> UI/UX studio (theme knobs, contrast checker)
```

## Beginner path (do in order)

1. **Learn** → lesson 1 (how code runs) → press Practice.
2. **Solver Lab** → path HTML → CSS → JavaScript → Python (locked tracks open as you finish).
3. **Typing** → Code mode to practice real syntax.
4. **Submit** your build → Export JSON to back up progress.

Stuck? Ask the Solver bot (type, 🎤 speak, or type `hint`). Offline? Everything works
except Python Run and voice (need internet / Chrome).
