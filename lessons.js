// Learn section: beginner reading lessons + earned ticks.
// Ticks ✅ are earned here (after reading + confirming a real build) or in Solver Lab —
// never free checkboxes. Works on file:// and localhost, localStorage only.
window.CDLessons = (() => {
  const LS = 'cd-levels-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
  const save = (d) => localStorage.setItem(LS, JSON.stringify(d));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (id) => document.getElementById(id);

  const MAP = {
    h1: { lesson: 'html-first', solver: 'solve-h1' }, h2: { lesson: 'html-form', solver: 'solve-h2' },
    h3: { lesson: 'html-first' }, h4: { lesson: 'html-first' }, h5: { lesson: 'html-first' },
    c1: { lesson: 'css-connect', solver: 'solve-c1' }, c2: { lesson: 'css-connect' },
    c3: { lesson: 'css-responsive', solver: 'solve-c2' }, c4: { lesson: 'css-connect' }, c5: { lesson: 'css-connect' },
    j1: { lesson: 'js-alive', solver: 'solve-j1' }, j2: { lesson: 'js-data', solver: 'solve-j2' },
    j3: { lesson: 'js-data' }, j4: { lesson: 'html-form' }, j5: { lesson: 'js-alive' },
    t1: { lesson: 'game-play' }, t2: { lesson: 'game-play' }, t3: { lesson: 'game-play' },
    t4: { lesson: 'game-play' }, t5: { lesson: 'game-play' },
    p1: { lesson: 'py-start', solver: 'solve-p1' }, p2: { lesson: 'py-start' },
    p3: { lesson: 'py-start', solver: 'solve-p2' }, p4: { lesson: 'py-start', solver: 'solve-p3' }, p5: { lesson: 'py-start' }
  };

  const LESSONS = [
    { id: 'start', level: 'Start', title: 'How code actually runs (read this first)',
      mins: '3 min', ticks: [], practice: { kind: 'typing', ref: 'easy', label: 'Try typing' },
      body: `<p>AI can write code for you — but <b>you</b> must know what happens next. Here is the whole secret:</p>
        <p>1. <b>HTML</b> = the bones. The browser reads your file top → bottom and builds the page.</p>
        <p>2. <b>CSS</b> = the paint. It recolors and rearranges what HTML built.</p>
        <p>3. <b>JavaScript</b> = the muscles. It reacts when you click, type, move.</p>
        <p>4. <b>Python</b> = a different brain. It cannot run in a page — an <b>interpreter</b> runs it line by line (our Run button does that).</p>
        <p>Rule of this site: <b>read → practice → tick ✅.</b> Nothing ticks itself.</p>` },
    { id: 'html-first', level: 'HTML', title: 'Your first tags: what a tag even is',
      mins: '5 min', ticks: [{ id: 'h3', label: 'I built a table (thead/tbody)' }, { id: 'h4', label: 'I used semantic tags' }, { id: 'h5', label: 'I embedded a page in an iframe' }],
      practice: { kind: 'solver', ref: 'h1', label: 'Code: profile card' },
      body: `<p>A <b>tag</b> is a labeled box: <code>&lt;h1&gt;Name&lt;/h1&gt;</code> — opens, content, closes. Tags can carry <b>attributes</b>: <code>&lt;img src="pic.png" alt="me"&gt;</code>.</p>
        <p>Table = <code>&lt;table&gt;</code> with <code>&lt;thead&gt;</code> (head row) + <code>&lt;tbody&gt;</code> (body rows). Semantic tags (<code>header nav main section footer</code>) tell the browser what each part <i>means</i>.</p>
        <p>Embed a page: <code>&lt;iframe src="page.html"&gt;&lt;/iframe&gt;</code> — a window into another page.</p>` },
    { id: 'html-form', level: 'HTML', title: 'Forms: how a page collects input',
      mins: '4 min', ticks: [], practice: { kind: 'solver', ref: 'h2', label: 'Code: contact form' },
      body: `<p>A <code>&lt;form&gt;</code> wraps inputs + a submit button. <code>type="email"</code> + <code>required</code> = free validation by the browser itself.</p>
        <p>Normally a form <i>sends</i> data to a server. Here we stop that and handle it in JavaScript instead (coming in JS lessons).</p>` },
    { id: 'css-connect', level: 'CSS', title: 'Connecting CSS to HTML (the bridge)',
      mins: '6 min', ticks: [{ id: 'c2', label: 'I built a 3-card grid' }, { id: 'c4', label: 'I animated a button' }, { id: 'c5', label: 'I recolored the arena HUD' }],
      practice: { kind: 'solver', ref: 'c1', label: 'Code: flexbox navbar' },
      body: `<p>3 ways, same idea — <b>selectors find HTML, rules paint it</b>:</p>
        <p>1. Inline: <code>&lt;p style="color:red"&gt;</code> (quick, messy).</p>
        <p>2. <code>&lt;style&gt;</code> block in <code>&lt;head&gt;</code> (this whole site's portfolio uses one).</p>
        <p>3. Separate file: <code>&lt;link rel="stylesheet" href="style.css"&gt;</code> (the game uses this).</p>
        <p><code>nav { display:flex }</code> means: find every &lt;nav&gt;, lay its children in a row. Class selector <code>.card { }</code> finds class="card".</p>` },
    { id: 'css-responsive', level: 'CSS', title: 'Responsive: one page, every screen',
      mins: '4 min', ticks: [], practice: { kind: 'solver', ref: 'c3', label: 'Code: responsive box' },
      body: `<p>Phones are narrow — so CSS asks the screen width: <code>@media (max-width: 600px) { .box { width:100% } }</code>. Rules inside win on small screens. Put media queries <b>after</b> desktop rules.</p>` },
    { id: 'js-alive', level: 'JavaScript', title: 'JS finds things and reacts',
      mins: '6 min', ticks: [{ id: 'j5', label: 'I changed bot speed in client.js' }],
      practice: { kind: 'solver', ref: 'j1', label: 'Code: click counter' },
      body: `<p>JavaScript runs <b>after</b> the HTML exists. Two moves do 90% of everything:</p>
        <p>1. <b>Find:</b> <code>document.getElementById("count")</code>. Wrong id → <code>null</code> → errors. Ids must match exactly.</p>
        <p>2. <b>React:</b> <code>btn.addEventListener("click", () => { ... })</code> — "when clicked, run this".</p>
        <p>The arena bots? Same idea: <code>moveBot()</code> runs every frame and steers toward orbs. Open <code>client.js</code> and change <code>10 * dt</code> — you just modded a game.</p>` },
    { id: 'js-data', level: 'JavaScript', title: 'Creating elements + remembering data',
      mins: '6 min', ticks: [{ id: 'j3', label: 'I fetched JSON and rendered it' }, { id: 'j4', label: 'I validated a form with JS' }],
      practice: { kind: 'solver', ref: 'j2', label: 'Code: mini todo' },
      body: `<p>JS can <b>create</b> HTML: <code>document.createElement("li")</code> + <code>list.appendChild(li)</code>. Pages remember via <code>localStorage</code> — but only <b>strings</b>, so arrays go through <code>JSON.stringify / JSON.parse</code>.</p>
        <p>Fetch = ask a URL for data: <code>fetch("/health").then(r => r.json())</code>. Our Tasks panel loads TASKS.md exactly like this.</p>` },
    { id: 'py-start', level: 'Python', title: 'Python: the interpreter reads lines',
      mins: '6 min', ticks: [{ id: 'p2', label: 'I used input() + f-strings' }, { id: 'p5', label: 'I solved all 3 Python tasks' }],
      practice: { kind: 'solver', ref: 'p1', label: 'Code: print + variables' },
      body: `<p>No browser here — an <b>interpreter</b> runs your file line by line. <code>print("Hi")</code> shows text. Variables are just named boxes: <code>name = "Dipen"</code>.</p>
        <p><b>Indentation is law:</b> after <code>def / for / if</code> lines ending with <code>:</code>, indent the block. Wrong spaces = crash. Our Run button executes real Python (needs internet once).</p>` },
    { id: 'game-play', level: 'Game', title: 'Play + mod the arena',
      mins: '5 min', ticks: [{ id: 't1', label: 'I won a 90s arena round' }, { id: 't2', label: 'I changed cube COLORS' }, { id: 't3', label: 'I added +5 orbs' }, { id: 't4', label: 'I added a 5th bot' }, { id: 't5', label: 'I submitted my game tweak' }],
      practice: { kind: 'game', label: 'Play fullscreen' },
      body: `<p>Run <code>npm run dev</code>, open the game: P1 <b>WASD + Space</b>, P2 <b>arrows + Enter</b>. Collect gold orbs, dash to bump rivals, 90 seconds.</p>
        <p>Mod it in <code>client.js</code>: <code>COLORS</code> (cube colors), <code>10</code> orbs in <code>startGame</code>, <code>10 * dt</code> bot speed in <code>moveBot</code>. Then submit your tweak below.</p>` }
  ];

  function practiceBtn(l) {
    if (!l.practice) return '';
    const p = l.practice;
    const label = p.label || 'Practice →';
    if (p.kind === 'solver') return `<button data-solve="${esc(p.ref)}" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">⚒ ${esc(label)}</button>`;
    if (p.kind === 'typing') return `<button data-typing="${esc(p.ref)}" style="background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">⌨ ${esc(label)}</button>`;
    if (p.kind === 'submit') return `<button data-goto="#submit" style="background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">📤 ${esc(label)}</button>`;
    if (p.kind === 'game') return `<button data-game="1" style="background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">🎮 ${esc(label)}</button>`;
    return '';
  }

  function render() {
    const root = $('learnRoot');
    if (!root) return;
    const done = load();
    root.innerHTML = '';
    LESSONS.forEach((l) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.id = 'lesson-' + l.id;
      const ticked = (l.ticks || []).filter((t) => done[t.id]).length;
      card.innerHTML = `<h4>${esc(l.title)}</h4>
        <div style="margin:.3rem 0 .6rem;"><span class="tag">${esc(l.level)}</span><span class="tag">${esc(l.mins)}</span>${l.ticks && l.ticks.length ? `<span class="tag">${ticked}/${l.ticks.length} ✓</span>` : ''}</div>
        <div data-body style="display:none;font-size:.9rem;color:var(--muted);line-height:1.7;">${l.body}
          ${(l.ticks || []).length ? '<div style="margin-top:.6rem;display:grid;gap:.35rem;">' + l.ticks.map((t) =>
            `<button data-tick="${t.id}" ${done[t.id] ? 'disabled' : ''} style="text-align:left;background:${done[t.id] ? '#dcfce7' : '#fff'};border:1.5px solid ${done[t.id] ? '#16a34a' : 'var(--border)'};border-radius:10px;padding:.45rem .7rem;font-size:.82rem;cursor:${done[t.id] ? 'default' : 'pointer'};">${done[t.id] ? '✅' : '⬜'} ${esc(t.label)}</button>`).join('') + '</div>' : ''}
        </div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.7rem;">
          <button data-read style="background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">📖 Read</button>
          ${practiceBtn(l)}
        </div>`;
      root.appendChild(card);
    });
    root.querySelectorAll('[data-read]').forEach((b) => {
      b.onclick = () => {
        const body = b.closest('.card').querySelector('[data-body]');
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        b.textContent = open ? '📖 Read' : '📕 Close';
      };
    });
    root.querySelectorAll('[data-tick]').forEach((b) => {
      b.onclick = () => {
        const d = load();
        d[b.dataset.tick] = 1; save(d);
        try { if (window.CDLevels && window.CDLevels.refresh) window.CDLevels.refresh(); } catch {}
        render();
      };
    });
    root.querySelectorAll('[data-solve]').forEach((b) => {
      b.onclick = () => {
        try {
          if (window.CDSolver && window.CDSolver.openLevel) window.CDSolver.openLevel(b.dataset.solve);
          else location.hash = '#solve';
        } catch { location.hash = '#solve'; }
      };
    });
    root.querySelectorAll('[data-typing]').forEach((b) => {
      b.onclick = () => {
        const s = $('typeDiff');
        if (s) s.value = b.dataset.typing;
        location.hash = '#typing';
      };
    });
    root.querySelectorAll('[data-goto]').forEach((b) => { b.onclick = () => { location.hash = b.dataset.goto; }; });
    root.querySelectorAll('[data-game]').forEach((b) => {
      b.onclick = () => window.open('CD-first/index.html', '_blank');
    });
  }

  function openLesson(id) {
    const card = $('lesson-' + id);
    if (!card) { location.hash = '#learn'; return; }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const body = card.querySelector('[data-body]');
    const btn = card.querySelector('[data-read]');
    if (body && body.style.display === 'none') { body.style.display = 'block'; if (btn) btn.textContent = '📕 Close'; }
    card.style.boxShadow = '0 0 0 3px rgba(79,70,229,.35)';
    setTimeout(() => { card.style.boxShadow = ''; }, 1600);
  }

  function init() { render(); }
  return { init, MAP, openLesson };
})();
