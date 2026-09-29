// CD-first learning-site server: portfolio + typing/solver/levels (Node + Socket.io relay kept for later)
// Run: npm install && npm run dev -> open http://localhost:3000/ (single site, no blank text page)
import express from 'express';
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

// Single-site serving: portfolio (parent) at / with typing + solver + levels sections.
// http://localhost:3000/ -> the ONLY page you need.
// Lab files stay at /CD-first/* (typing hub, solver, lessons engines).
const parentDir = path.join(__dirname, '..');
app.use(express.static(parentDir));
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
http.listen(PORT, '0.0.0.0', () => {
  console.log(`CD-first single site on http://localhost:${PORT}/  (portfolio + typing + solver + levels)`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`If browser says ERR_CONNECTION_REFUSED, this server is not running — run: npm run dev`);
});
