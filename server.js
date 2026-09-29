// CD-first online relay server (Node + Socket.io)
// Run: npm install && npm start  -> deploy to Render/Railway, paste URL in game.
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' } });

app.get('/', (req, res) => res.send('CD-first server running. Connect from index.html Online mode.'));
app.get('/health', (req, res) => res.json({ ok: true, players: io.engine.clientsCount }));

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
