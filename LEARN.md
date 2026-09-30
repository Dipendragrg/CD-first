# LEARN.md — file map for the curious (beginners start at Learn lesson 1 on the site)

## How it fits together

- Open **`index.html`** → sections load in order: About, Skills, Projects, Typing, Learn, Levels, Solver, Design, Submit, Contact.
- `solver.js` runs the Solver Lab: task picker, HTML/CSS/JS/Python editors, Run preview, Check verdicts (some checks really click your buttons), locks + path stepper, ask-bot with voice.
- `projects.js` registers 4 bigger builds into the solver (scoreboard table, card grid, validated form, bill splitter).
- `lessons.js` renders reading lessons; ticks ✅ land in the same store as Levels.
- `levels-submit.js` renders Levels XP + the project showcase (localStorage only).
- `typing.js` powers Typing Lab + `typing-hub.html` (WPM, accuracy, bests).
- `voice.js` = mic + spoken replies. `autocomplete.js` = code hints popup. `design.js` = theme studio + contrast math.
- `server.js` serves the folder + `/health`. No database anywhere.

## Practice ideas (easy → hard)

1. Typing Code mode: type the flexbox line 5× without looking.
2. Solver: finish all HTML, watch CSS unlock.
3. Studio: build a theme with 7:1 contrast, copy its CSS, submit it as a project.
4. Build: complete all 4 guided builds, then submit your own bill splitter variant.
5. Read `solver.js` `runCheck()` — add a 7th check type of your own.

## Troubleshooting

- `localhost` refused? Server isn't running → `npm run dev`, keep the window open.
- Port busy? Server tells you: kill node or `PORT=3001 npm run dev` (mac/Linux) / `$env:PORT=3001; npm run dev` (Windows).
- Python Run stuck? Needs internet once (Pyodide CDN). Static checks still run.
- Mic/speak dead? Chrome/Edge required; typing works everywhere.
- Progress gone? Same browser + Export JSON regularly (Submit section).
