# CD-first — Cube Arena

Three.js multiplayer arena game. Playable instantly on GitHub Pages (static), with optional Node server for online.

## Play now (no install)
1. Open `index.html` directly, or `npx serve .`
2. Choose:
   - **1 Player vs Bots** — WASD + Space
   - **2 Players Local** — P1 WASD+Space vs P2 Arrows+Enter
   - **Online** — needs `server.js` URL, else falls back to bots

Collect gold orbs. Dash to bump rivals. 90s round, highest score wins.

## Push to your GitHub account (CD-first, public)
```powershell
Set-Location "C:\Users\ssdev\OneDrive\Documents\Default Project\CD-first"
git init
git add .
git commit -m "Initial CD-first game"
git branch -M main
# create empty public repo named CD-first at https://github.com/new first, then:
git remote add origin https://github.com/YOUR-USERNAME/CD-first.git
git push -u origin main
```
Then enable Pages: repo Settings > Pages > Deploy from branch > main / root. Game at `https://YOUR-USERNAME.github.io/CD-first/`.

## Online server (optional)
```bash
npm install
npm start
```
Deploy `server.js` to Render/Railway, paste `https://xxx.onrender.com` into the game Online box.

Files: `C:\Users\ssdev\OneDrive\Documents\Default Project\CD-first\index.html:1`, `client.js`, `server.js`, `style.css`
