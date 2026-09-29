// CD-first game server: serves the actual game + online relay (Node + Socket.io)
// Run: npm install && npm start -> open http://localhost:3000 (game loads, no blank text page)
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

// Serve portfolio (parent) at / and game at /CD-first + /game
// http://localhost:3000/ -> portfolio (Default Project/index.html) with game section
// http://localhost:3000/CD-first/ and /game/ -> Cube Arena game
const parentDir = path.join(__dirname, '..');
app.use(express.static(parentDir));
app.use('/game', express.static(__dirname));
app.get('/health', (req, res) => res.json({ ok: true, players: io.engine.clientsCount }));
app.get('/server-info', (req, res) => res.send('CD-first server running. Game at / , health at /health.'));

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

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`CD-first server on :${PORT}`));
