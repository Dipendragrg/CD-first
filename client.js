import * as THREE from 'three';

const container = document.getElementById('game');
const scoresEl = document.getElementById('scores');
const timerEl = document.getElementById('timer');
const hud = document.getElementById('hud');
const msg = document.getElementById('msg');
const onlineBox = document.getElementById('onlineBox');

let scene, camera, renderer, clock;
let players = [], orbs = [];
let mode = '1p';
let timeLeft = 90, running = false, socket = null;

const ARENA = 14;
const COLORS = [0x3b82f6, 0xef4444, 0x22c55e, 0xf59e0b];

initThree();

document.getElementById('btn1p').onclick = () => startGame('1p');
document.getElementById('btn2p').onclick = () => startGame('2p');
document.getElementById('btnRestart').onclick = () => startGame(mode);
document.getElementById('btnOnline').onclick = () => {
  onlineBox.classList.toggle('hidden');
  startOnline();
};

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1020);
  scene.fog = new THREE.Fog(0x0b1020, 30, 70);
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 18, 16);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(10, 20, 8);
  dir.castShadow = true;
  scene.add(dir);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(ARENA * 2 + 4, ARENA * 2 + 4),
    new THREE.MeshStandardMaterial({ color: 0x111c33 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  scene.add(new THREE.GridHelper(ARENA * 2 + 4, 16, 0x2563eb, 0x1e293b));

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
  const wallGeoH = new THREE.BoxGeometry(ARENA * 2 + 4, 2, 1);
  const wallGeoV = new THREE.BoxGeometry(1, 2, ARENA * 2 + 4);
  [[0, -ARENA-1.5, wallGeoH], [0, ARENA+1.5, wallGeoH]].forEach(([x, z, g]) => {
    const m = new THREE.Mesh(g, wallMat); m.position.set(x, 1, z); scene.add(m);
  });
  [[-ARENA-1.5, 0], [ARENA+1.5, 0]].forEach(([x, z]) => {
    const m = new THREE.Mesh(wallGeoV, wallMat); m.position.set(x, 1, z); scene.add(m);
  });

  clock = new THREE.Clock();
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  renderer.setAnimationLoop(tick);
  setupInput();
}

function clearWorld() {
  players.forEach(p => scene.remove(p.mesh));
  orbs.forEach(o => scene.remove(o.mesh));
  players = []; orbs = [];
}

function makePlayer(i, isBot, isHuman2) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: COLORS[i % 4] })
  );
  mesh.castShadow = true;
  mesh.position.set((i - 1.5) * 5, 0.7, (i % 2 ? 5 : -5));
  scene.add(mesh);
  players.push({
    id: i, mesh, vel: new THREE.Vector3(),
    score: 0, isBot, isHuman2,
    dashCd: 0, label: isHuman2 ? 'P2' : isBot ? 'BOT' + (i + 1) : 'P1'
  });
}

function spawnOrb() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0x854d0e })
  );
  mesh.position.set((Math.random() * 2 - 1) * ARENA, 0.45, (Math.random() * 2 - 1) * ARENA);
  mesh.castShadow = true;
  scene.add(mesh);
  orbs.push({ mesh });
}

function startGame(m) {
  mode = m;
  clearWorld();
  if (socket) { socket.disconnect(); socket = null; }
  if (m === '1p') { makePlayer(0, false, false); makePlayer(1, true); makePlayer(2, true); makePlayer(3, true); }
  else { makePlayer(0, false, false); makePlayer(1, false, true); makePlayer(2, true); makePlayer(3, true); }
  for (let i = 0; i < 10; i++) spawnOrb();
  timeLeft = 90; running = true;
  hud.classList.remove('hidden');
  setMsg(m === '2p' ? 'Local multiplayer: P1 WASD vs P2 Arrows!' : 'Collect gold orbs! Dash to bump rivals!');
}

function startOnline() {
  const url = document.getElementById('serverUrl').value.trim();
  if (!url) {
    setMsg('No server set — starting bot match. Run server.js to enable real online play.');
    startGame('1p');
    return;
  }
  try {
    socket = window.io(url);
    socket.on('connect', () => setMsg('Connected online! Sending positions...'));
    socket.on('connect_error', () => setMsg('Cannot reach server — fallback to bots.'));
    startGame('1p');
  } catch { setMsg('Online lib error — playing bots.'); startGame('1p'); }
}

function setMsg(t) { msg.textContent = t; }

// ---- input ----
const keys = {};
function setupInput() {
  addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space') dash(0);
    if (e.code === 'Enter') dash(1);
  });
  addEventListener('keyup', e => keys[e.code] = false);
  let sx = 0, sy = 0, dragging = false;
  addEventListener('touchstart', e => {
    const t = e.touches[0];
    if (t.clientX < innerWidth / 2) { sx = t.clientX; sy = t.clientY; dragging = true; }
    else dash(0);
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (!dragging || !players[0]) return;
    const t = e.touches[0];
    players[0].vel.x = (t.clientX - sx) * 0.05;
    players[0].vel.z = (t.clientY - sy) * 0.05;
  }, { passive: true });
  addEventListener('touchend', () => dragging = false);
}

function dash(i) {
  const p = players[i];
  if (!p || !running || p.dashCd > 0) return;
  p.vel.multiplyScalar(2.8);
  p.vel.y = 0;
  if (p.vel.lengthSq() < 1) p.vel.set(Math.random() - .5, 0, Math.random() - .5).normalize().multiplyScalar(18);
  p.dashCd = 1.2;
}

function moveHuman(p, dt) {
  const sp = 14 * dt;
  const ax = p.isHuman2
    ? (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0)
    : (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const az = p.isHuman2
    ? (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0)
    : (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0);
  // touch already sets vel for P1; blend keyboard
  if (!(p === players[0] && Math.abs(p.vel.x) > 0.1 && ('ontouchstart' in window))) {
    p.vel.x += ax * sp;
    p.vel.z += az * sp;
  }
}

function moveBot(p, dt) {
  let best = null, bd = 1e9;
  for (const o of orbs) {
    const d = p.mesh.position.distanceToSquared(o.mesh.position);
    if (d < bd) { bd = d; best = o; }
  }
  if (!best) return;
  const dir = best.mesh.position.clone().sub(p.mesh.position).setY(0).normalize();
  p.vel.x += dir.x * 10 * dt;
  p.vel.z += dir.z * 10 * dt;
  if (Math.random() < 0.01) dash(p.id);
}

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (running) {
    timeLeft -= dt;
    timerEl.textContent = Math.ceil(timeLeft);
    if (timeLeft <= 0) endGame();
    for (const p of players) {
      if (p.isBot) moveBot(p, dt);
      else moveHuman(p, dt);
      p.dashCd = Math.max(0, p.dashCd - dt);
      p.vel.multiplyScalar(0.92);
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.position.x = Math.max(-ARENA, Math.min(ARENA, p.mesh.position.x));
      p.mesh.position.z = Math.max(-ARENA, Math.min(ARENA, p.mesh.position.z));
      p.mesh.rotation.y += p.vel.length() * dt * 0.2;
      // collect orbs
      for (let i = orbs.length - 1; i >= 0; i--) {
        if (p.mesh.position.distanceTo(orbs[i].mesh.position) < 1.3) {
          scene.remove(orbs[i].mesh);
          orbs.splice(i, 1);
          p.score++;
          spawnOrb();
        }
      }
    }
    // bump collisions
    for (let i = 0; i < players.length; i++) for (let j = i + 1; j < players.length; j++) {
      const a = players[i], b = players[j];
      const d = a.mesh.position.distanceTo(b.mesh.position);
      if (d < 1.6 && d > 0.01) {
        const push = a.mesh.position.clone().sub(b.mesh.position).normalize().multiplyScalar(8 * dt);
        a.mesh.position.add(push); b.mesh.position.sub(push);
      }
    }
    orbs.forEach((o, i) => { o.mesh.rotation.y += dt * 2; o.mesh.position.y = 0.45 + Math.sin(Date.now() * 0.004 + i) * 0.1; });
    scoresEl.innerHTML = players.map(p =>
      `<span style="color:#${COLORS[p.id % 4].toString(16).padStart(6, '0')}">${p.label}:${p.score}</span>`).join('');
    if (socket?.connected) socket.emit('pos', { id: 0, x: players[0]?.mesh.position.x, z: players[0]?.mesh.position.z });
  }
  renderer.render(scene, camera);
}

function endGame() {
  running = false;
  const win = [...players].sort((a, b) => b.score - a.score)[0];
  setMsg(`🏆 ${win.label} wins with ${win.score} orbs! Press Restart.`);
}
