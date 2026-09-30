// CD-first learning-site server: portfolio + typing/solver/levels (Node + Socket.io relay kept for later)
// Run: npm install && npm run dev -> open http://localhost:3000/ (single site, no blank text page)
import express from 'express';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' } });

// Self-contained site: this folder IS the website. Clone anywhere, npm install, npm run dev.
// http://localhost:3000/ -> portfolio (index.html) with typing + solver + levels sections.
app.use(express.static(__dirname));
app.get('/health', (req, res) => res.json({ ok: true, players: io.engine.clientsCount }));
app.get('/server-info', (req, res) => res.send('CD-first server running. Open / for the site, /health for status.'));

const positions = new Map();

io.on('connection', (socket) => {
  console.log('join', socket.id);
  socket.on('pos', (p) => {
    positions.set(socket.id, p);
    socket.broadcast.emit('peer', { id: socket.id, ...p });
  });
  socket.on('disconnect', () => {
    positions.delete(socket.id);
    socket.broadcast.emit('leave', socket.id);
  });
});

const PORT = Number(process.env.PORT) || 3000;
http.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Another server is running — reuse it, or kill it:\n  Get-Process -Name node | Stop-Process -Force\nor run on another port:\n  $env:PORT=3001; npm run dev`);
    process.exit(1);
  }
  throw e;
});
function lanIP() {
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === 'IPv4' && !n.internal) return n.address;
    }
  }
  return 'localhost';
}
http.listen(PORT, '0.0.0.0', () => {
  console.log(`CD-first site on http://localhost:${PORT}/  (portfolio + typing + solver + levels)`);
  console.log(`Same WiFi? Open http://${lanIP()}:${PORT}/ on another computer or phone.`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`If browser says ERR_CONNECTION_REFUSED, this server is not running — run: npm run dev`);
});
