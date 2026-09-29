# CD-first — Run on your PC + Learn each file

## 1. Run the game on your PC (pick 1)

**You need:** Windows PC + browser (Chrome/Edge) + internet (for Three.js CDN). No install for basic play.

### Option A — Double-click (fastest, 1P/2P local only)
1. Open folder `CD-first`
2. Double-click `index.html`
3. Click `▶ 1 Player vs Bots` or `👥 2 Players Local`
4. Controls: P1 `WASD + Space`, P2 `Arrows + Enter`

### Option B — VS Code (recommended)
1. Install VS Code + extension `Live Server`
2. Open `CD-first` folder > right-click `index.html` > `Open with Live Server`
3. Plays at `http://127.0.0.1:5500`

### Option C — Command line static server
```powershell
Set-Location "C:\Users\ssdev\OneDrive\Documents\Default Project\CD-first"
# pick one:
npx serve .
# or:
python -m http.server 8000
# then open http://localhost:8000  or  http://localhost:3000
```

### Option D — With online multiplayer server
```powershell
Set-Location "C:\Users\ssdev\OneDrive\Documents\Default Project\CD-first"
npm install
npm start
# open http://localhost:3000/health -> {"ok":true}
# open game, paste http://localhost:3000 into Online box, press Online
```

## 2. Project map — what each file does

```
CD-first/
  index.html   -> page structure + menu + loads Three.js + client.js
  style.css    -> all UI styling, HUD, buttons, mobile layout
  client.js    -> entire game: scene, players, bots, orbs, physics, loop
  server.js    -> optional Node relay for online positions
  package.json -> Node deps (express, socket.io) + npm start
  README.md    -> push + Pages deploy guide
  LEARN.md     -> this file: learn + exercises
```

### index.html (46 lines)
- `importmap`: tells browser where `three` comes from (`unpkg.com/three@0.160.0`)
- `#ui`: title, 3 buttons (`btn1p/btn2p/btnOnline`), `#hud` scores+timer, `#help`, `#onlineBox`
- `#game`: empty div where Three.js canvas is injected
- Scripts: `socket.io` CDN + `client.js` as `type=module`
- **Try:** change `<title>`, add a 4th button, change placeholder URL.

### style.css
- Dark theme, `#ui` overlay with `pointer-events:none` except menu (so canvas gets mouse)
- `.menu button`, `#hud`, `#scores`, `#timer`, `#onlineBox`
- Mobile `@media(max-width:600px)` stacks menu
- **Try:** change button color, HUD background, add your own font.

### client.js (243 lines) — read in 5 parts
1. **Setup (1-27):** imports THREE, grabs DOM, globals `players/orbs/mode/timeLeft`, binds buttons.
2. **initThree (28-...):** scene+fog, camera at (0,18,16), renderer+shadows, lights, ground plane + GridHelper, 4 walls, resize handler, `setAnimationLoop(tick)`.
3. **World builders:** `clearWorld()`, `makePlayer(i,isBot,isHuman2)` (BoxGeometry 1.4, color from COLORS, spawn pos), `spawnOrb()` (gold Sphere 0.45 random in ARENA=14), `startGame('1p'/'2p')` (1P=1 human+3 bots, 2P=2 humans+2 bots, 10 orbs, 90s).
4. **Input:** `keys{}`, WASD vs Arrows, Space/Enter `dash(i)` (2.8x burst, 1.2s cooldown), touch: left-half drag moves P1, right tap dashes.
5. **Loop `tick()`:** `dt` clamp, timer countdown, `moveHuman`/`moveBot` (bot seeks nearest orb), friction 0.92, clamp to ARENA, spin by speed, orb collect (dist<1.3 → score++, respawn), player bump push, orb bob animation, HUD update, `socket.emit('pos')` if online, `endGame()` picks max score winner.
- **Try:** change ARENA to 20, timeLeft to 30, orb size, dash power 2.8→4.

### server.js (29 lines)
- Express + http + Socket.io with `cors:*`
- `GET /` + `/health` for checks
- `positions Map`, on `connection`: listen `pos` → `broadcast peer`, on `disconnect` → broadcast `leave`
- Listens `PORT` (3000 or Render PORT)
- This is a relay, not authoritative — trust client for learning simplicity.
- **Try:** log positions count, add `chat` event, block empty messages.

### package.json
- `type:module` (allows `import`), `start: node server.js`, deps `express@4`, `socket.io@4`
- **Try:** run `npm install`, `npm start`, visit `/health`.

## 3. Solve-it-yourself tasks (easy → hard)

1. **Change colors:** edit `COLORS` in `client.js`, reload, see cubes change.
2. **More orbs:** change `10` in `startGame` to `20`.
3. **Faster game:** change `14*dt` speed to `20*dt`, `90`s to `60`s.
4. **New wall color:** edit `wallMat` color in `initThree`.
5. **Add 5th bot:** add `makePlayer(4,true)` in 1p mode + extend COLORS.
6. **Jump dash:** in `dash()` add `p.mesh.position.y += 1`.
7. **Sound:** add `new Audio()` beep on orb collect.
8. **High score:** save `localStorage.setItem('best', win.score)` in `endGame()`.
9. **Online names:** send `{name}` with `pos`, show in scores.
10. **Authoritative server:** move orb spawn to `server.js`, emit `orbs` to clients.

Answers: all in this repo — compare your edit to git `main` with `git diff`.

## 4. Troubleshooting
- Black screen? Check internet (Three.js CDN needs it) + F12 Console.
- `importmap` error? Use Chrome/Edge 90+, not old IE.
- `npm start` fails? Run `node -v` (need 18+), then `npm install`.
- Port busy? Change `3000` to `3001` in `server.js` + URL box.
