// CD-first Solver Lab engine (no backend — checker + helper bot run in your browser).
// Loaded by portfolio: <script src="CD-first/solver.js"></script> then CDSolver.init({...}).
// Solved tasks auto-award XP to the Levels system (same localStorage key).
window.CDSolver = (() => {
  const LS_DONE = 'cd-levels-v1', LS_SOLVED = 'cd-solved-v1';
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const has = (code, re) => re.test(code);

  const TASKS = [
    { id: 'solve-h1', level: 'HTML', levelTask: 'h1', title: 'Profile card in HTML',
      brief: 'Make a tiny profile card. Only three things: a name, a photo, a link.',
      steps: ['1. Type <h1>, your name, then </h1> — every opener needs its closer.', '2. Add <img>: src is the photo address, alt is words if it breaks.', '3. Add <a>: href is the link address, words go between the tags.', 'Press Run to SEE it, then Check to prove it.'],
      starter: { html: '<h1>Your Name</h1>\n<!-- add img + link here -->', css: '', js: '' }, tab: 'html',
      checks: [
        { id: 'h1', desc: 'Has an <h1> heading', fn: (c, d) => has(c.html, /<h1[\s>]/i) && !!(d && d.querySelector('h1')) },
        { id: 'img', desc: 'Has <img> with src + alt', fn: (c) => has(c.html, /<img[^>]*src=/i) && has(c.html, /<img[^>]*alt=/i) },
        { id: 'a', desc: 'Has <a> link with href', fn: (c, d) => has(c.html, /<a[^>]*href=/i) && !!(d && d.querySelector('a[href]')) } ],
      hints: ['Start with <h1>Dipen</h1>.', 'Image: <img src="https://via.placeholder.com/150" alt="photo">.', 'Link: <a href="https://github.com">My GitHub</a>.'] },
    { id: 'solve-h2', level: 'HTML', levelTask: 'h2', title: 'Contact form',
      brief: 'Build a form that rejects bad email. Three parts: name box, email box, send button.',
      steps: ['1. Wrap everything in <form>...</form> so one submit collects it all.', '2. Name box: <input type="text" required> — required blocks empty sends.', '3. Email box: <input type="email" required> — the browser checks the @ for you.', '4. <button type="submit">Send</button> — no button means no sending.'],
      starter: { html: '<form>\n  <!-- name + email + button -->\n</form>', css: '', js: '' }, tab: 'html',
      checks: [
        { id: 'form', desc: 'Inputs wrapped in <form>', fn: (c) => has(c.html, /<form[\s>]/i) },
        { id: 'email', desc: 'Email input with type=email + required', fn: (c) => has(c.html, /<input[^>]*type=["']email["']/i) && has(c.html, /required/i) },
        { id: 'btn', desc: 'Submit button present', fn: (c, d) => has(c.html, /<button[^>]*type=["']submit["']/i) || !!(d && d.querySelector('button')) } ],
      hints: ['<input type="text" placeholder="Name" required>.', '<input type="email" placeholder="Email" required>.', '<button type="submit">Send</button>.'] },
    { id: 'solve-c1', level: 'CSS', levelTask: 'c1', title: 'Flexbox navbar',
      brief: 'Turn 3 stacked links into a side-by-side navbar. One CSS rule does the magic.',
      steps: ['1. HTML is already given — work only in the CSS tab.', '2. nav { display: flex; } — children line up in a row.', '3. Add gap: 1rem for spaces and justify-content: space-between to spread them.', '4. nav a { text-decoration: none; font-weight: bold; } — links stop looking 1999.'],
      starter: { html: '<nav>\n  <a href="#">Home</a>\n  <a href="#">Game</a>\n  <a href="#">Contact</a>\n</nav>', css: '/* style nav + a here */', js: '' }, tab: 'css',
      checks: [
        { id: 'flex', desc: 'nav uses display: flex', fn: (c) => has(c.css, /display\s*:\s*flex/i) },
        { id: 'gap', desc: 'Uses gap or justify-content', fn: (c) => has(c.css, /gap\s*:/i) || has(c.css, /justify-content\s*:/i) },
        { id: 'links', desc: 'Links styled (no underline)', fn: (c) => has(c.css, /text-decoration\s*:\s*none/i) } ],
      hints: ['nav { display: flex; gap: 1rem; justify-content: space-between; }', 'nav a { text-decoration: none; font-weight: bold; }', 'Give nav a background + padding.'] },
    { id: 'solve-c2', level: 'CSS', levelTask: 'c3', title: 'Responsive box',
      brief: 'One box, two sizes: wide on a laptop, full-width on a phone.',
      steps: ['1. HTML is given — a <div class="box">. Touch only CSS.', '2. .box { width: 400px; background: ...; } so you can SEE it.', '3. @media (max-width: 600px) { .box { width: 100%; } } — small screens get full width.'],
      starter: { html: '<div class="box">Hello</div>', css: '.box {\n  /* width + background */\n}', js: '' }, tab: 'css',
      checks: [
        { id: 'box', desc: '.box has width + background', fn: (c) => has(c.css, /\.box/i) && has(c.css, /width\s*:/i) && has(c.css, /background/i) },
        { id: 'media', desc: 'Has @media (max-width: 600px)', fn: (c) => has(c.css, /@media[^{]*max-width\s*:\s*600px/i) },
        { id: 'live', desc: 'Preview shows the box', fn: (c, d) => !!(d && d.querySelector('.box')) } ],
      hints: ['.box { width: 400px; background: #4f46e5; color: white; padding: 2rem; }', '@media (max-width: 600px) { .box { width: 100%; } }', 'Press Run first — live checks need the preview.'] },
    { id: 'solve-j1', level: 'JavaScript', levelTask: 'j1', title: 'Click counter',
      brief: 'A number on screen and a +1 button. My bot will REALLY click your button to verify.',
      steps: ['1. HTML is given: <span id="count">0</span> and <button id="plus">. Touch only JS.', '2. Grab both with getElementById — wrong spelling gives null and crashes.', '3. On click: read the number, add 1, write it back with textContent.'],
      starter: { html: '<p>Count: <span id="count">0</span></p>\n<button id="plus">+1</button>', css: '', js: '// select elements + click handler' }, tab: 'js',
      checks: [
        { id: 'sel', desc: 'Selects elements (getElementById/querySelector)', fn: (c) => has(c.js, /getElementById|querySelector/i) },
        { id: 'lis', desc: 'Listens for click', fn: (c) => has(c.js, /addEventListener\s*\(\s*['"]click['"]/i) },
        { id: 'live', desc: 'LIVE: bot clicks +1 and number grows', fn: (c, d) => {
          try {
            if (!d) return false;
            const btn = d.querySelector('#plus'), out = d.querySelector('#count');
            if (!btn || !out) return false;
            const before = parseInt(out.textContent, 10) || 0;
            btn.click(); btn.click();
            return (parseInt(out.textContent, 10) || 0) >= before + 2;
          } catch { return false; } } } ],
      hints: ['const out = document.getElementById("count");', 'document.getElementById("plus").addEventListener("click", () => { out.textContent = Number(out.textContent) + 1; });', 'The LIVE check really clicks — press Run, then Check.'] },
    { id: 'solve-j2', level: 'JavaScript', levelTask: 'j2', title: 'Mini todo (add item)',
      brief: 'Your first real app: type text, press Add, it appears — and survives reload.',
      steps: ['1. HTML is given. Touch only JS.', '2. On click: make an <li> (createElement), fill it with the input words (textContent), stick it in the list (appendChild).', '3. Bonus: save the list with localStorage so a reload keeps it.'],
      starter: { html: '<input id="todo" placeholder="New task">\n<button id="add">Add</button>\n<ul id="list"></ul>', css: '', js: '// click handler here' }, tab: 'js',
      checks: [
        { id: 'create', desc: 'Creates li via createElement', fn: (c) => has(c.js, /createElement\s*\(\s*['"]li['"]/i) },
        { id: 'append', desc: 'Adds it with appendChild/append', fn: (c) => has(c.js, /appendChild|append\s*\(/i) },
        { id: 'live', desc: 'LIVE: bot types + Adds, list grows', fn: (c, d) => {
          try {
            if (!d) return false;
            const inp = d.querySelector('#todo'), btn = d.querySelector('#add'), ul = d.querySelector('#list');
            if (!inp || !btn || !ul) return false;
            const before = ul.children.length;
            inp.value = 'bot-test'; inp.dispatchEvent(new Event('input', { bubbles: true }));
            btn.click();
            return ul.children.length > before;
          } catch { return false; } } } ],
      hints: ['document.getElementById("add").addEventListener("click", () => { ... });', 'const li = document.createElement("li"); li.textContent = input.value; list.appendChild(li);', 'Bonus: localStorage.setItem("todos", JSON.stringify([...])).'] },
    { id: 'solve-p1', kind: 'py', level: 'Python', levelTask: 'p1', title: 'Print + variables',
      brief: 'Your first Python: make the computer say hello with a name inside.',
      steps: ['1. Open the Python tab. Keep: name = "Dipen" — a named box holding words.', '2. Under it add: print("Hello", name). print SHOWS — without it nothing appears.', '3. Press Run (internet needed once), read the output box, then Check.'],
      starter: { html: '', css: '', js: '', py: 'name = "Dipen"\n# print hello with name' }, tab: 'py', expected: 'Hello Dipen',
      checks: [
        { id: 'var', desc: 'Makes a name variable (=)', fn: (c) => has(c.py, /=/) },
        { id: 'print', desc: 'Uses print(', fn: (c) => has(c.py, /print\s*\(/i) },
        { id: 'out', desc: 'Output says "Hello Dipen"', out: 'Hello Dipen' } ],
      hints: ['name = "Dipen"', 'print("Hello", name)', 'Output box must show: Hello Dipen'] },
    { id: 'solve-p2', kind: 'py', level: 'Python', levelTask: 'p3', title: 'Loop sum 1 to 5',
      brief: 'Add 1+2+3+4+5 without typing five numbers. A loop does the repeating.',
      steps: ['1. Start the box: total = 0.', '2. for i in range(1, 6): means i becomes 1,2,3,4,5 (NOT 6). Indent the next line 2 spaces.', '3. Inside: total = total + i. Outside: print(total) must show 15.'],
      starter: { html: '', css: '', js: '', py: 'total = 0\n# loop 1..5 and add\nprint(total)' }, tab: 'py', expected: '15',
      checks: [
        { id: 'for', desc: 'Uses for ... in range(', fn: (c) => has(c.py, /for\s+\w+\s+in\s+range\s*\(/i) },
        { id: 'add', desc: 'Adds to total', fn: (c) => has(c.py, /total\s*=\s*total\s*\+|total\s*\+=/i) },
        { id: 'out', desc: 'Output is 15', out: '15' } ],
      hints: ['for i in range(1, 6):', '    total = total + i  (indent matters!)', 'print(total)  → 15'] },
    { id: 'solve-p3', kind: 'py', level: 'Python', levelTask: 'p4', title: 'Your first function',
      brief: 'Pack code into a reusable function, then call it like ordering food.',
      steps: ['1. def greet(name): is the recipe. Lines under it MUST be indented.', '2. Inside: print("Namaste", name). Outside: greet("Ram") places the order.', '3. Defining without calling runs NOTHING. Run + Check.'],
      starter: { html: '', css: '', js: '', py: '# define greet + call greet("Ram")' }, tab: 'py', expected: 'Namaste Ram',
      checks: [
        { id: 'def', desc: 'Defines def greet(', fn: (c) => has(c.py, /def\s+greet\s*\(/i) },
        { id: 'call', desc: 'Calls greet("Ram")', fn: (c) => has(c.py, /greet\s*\(\s*["']Ram["']\s*\)/) },
        { id: 'out', desc: 'Output is "Namaste Ram"', out: 'Namaste Ram' } ],
      hints: ['def greet(name):', '    print("Namaste", name)', 'greet("Ram")'] }
  ];

  const KB = [
    { k: ['flex', 'navbar', 'horizontal'], a: 'Flexbox: parent { display: flex; gap: 1rem; justify-content: space-between; align-items: center; }. Children line up in a row automatically.' },
    { k: ['center', 'middle'], a: 'Centering: text → text-align:center. Block → margin:0 auto + width. Flex → display:flex; justify-content:center; align-items:center; min-height.' },
    { k: ['media', 'responsive', 'mobile', 'phone'], a: '@media (max-width: 600px) { ... } overrides styles on small screens. Put it AFTER the desktop rules so it wins.' },
    { k: ['click', 'addeventlistener', 'button not work'], a: 'Pattern: const b = document.getElementById("plus"); b.addEventListener("click", () => { ... }); — check the id matches exactly (case-sensitive).' },
    { k: ['null', 'cannot read', 'undefined'], a: '"Cannot read properties of null" = getElementById found nothing. Fix: id spelling must match, and script must run AFTER the HTML (our preview does this).' },
    { k: ['img', 'image not', 'picture'], a: 'Images need src + alt: <img src="https://via.placeholder.com/150" alt="desc">. Broken icon = wrong URL or missing quotes.' },
    { k: ['form', 'email', 'valid'], a: 'Use <input type="email" required> — browser validates free. required on 2+ inputs, submit via <button type="submit"> inside <form>.' },
    { k: ['localstorage', 'reload', 'save', 'remember'], a: 'localStorage.setItem("k", JSON.stringify(arr)) to save; JSON.parse(localStorage.getItem("k") || "[]") to load. Only strings allowed — hence JSON.' },
    { k: ['loop', 'array', 'foreach', 'each'], a: 'Loop an array: arr.forEach(item => { ... }) or for (const x of arr) { ... }. Build HTML strings and set ul.innerHTML, or createElement per item.' },
    { k: ['iframe', 'embed', 'page'], a: 'Embed a page: <iframe src="typing-hub.html" style="width:100%;height:700px;border:0"></iframe>. Same-folder relative paths work on file:// too.' },
    { k: ['what to do', 'instruction', 'task', 'start', 'stuck'], a: 'Read the 3–4 numbered steps above the editor, press Run to see your preview, then Check. Failing checks turn into exact hints — ask me "hint".' },
    { k: ['hint'], a: 'HINT-MODE' },
    { k: ['print', 'python', 'hello py'], a: 'Python prints with parentheses: print("Hello", name). No semicolons. Strings in "quotes".' },
    { k: ['def', 'function python', 'greet'], a: 'def greet(name): then INDENTED body (2 spaces), then call greet("Ram"). Same indent = same block.' },
    { k: ['range', 'loop python', 'for i'], a: 'range(1, 6) gives 1..5 (end excluded). for i in range(1, 6): total = total + i — indent the repeated line!' },
    { k: ['indent', 'indented block', 'unexpected indent'], a: 'IndentationError = spaces wrong. After def/for/if lines ending with :, indent exactly. Never mix tabs and spaces.' },
    { k: ['typing', 'wpm', 'type fast'], a: 'Typing Lab: pick Easy first, press Start, type exactly. 80%+ accuracy saves best. Speed comes after accuracy!' },
    { k: ['hello', 'hi', 'hey', 'namaste'], a: 'Hello! I am the Solver bot. Pick a task, write code, press Check — or ask me about flex, media queries, clicks, forms, localStorage.' }
  ];

  let cur = TASKS[0], code = {}, lastResults = [], lastPyOut = '';
  const $ = (id) => document.getElementById(id);
  // Guided path: HTML first, then CSS, JS, Python unlock in order. Game track stays open.
  const ORDER = ['HTML', 'CSS', 'JavaScript', 'Python'];
  const solvedIds = () => load(LS_SOLVED, {});
  function isUnlocked(level) {
    const i = ORDER.indexOf(level);
    if (i <= 0) return true;
    const prev = ORDER[i - 1], s = solvedIds();
    return TASKS.filter((t) => t.level === prev).every((t) => s[t.id]);
  }
  function firstUnsolved(level) {
    const s = solvedIds();
    return TASKS.find((t) => t.level === level && !s[t.id]);
  }
  function lockMsg(level) {
    const i = ORDER.indexOf(level), prev = ORDER[i - 1];
    const next = firstUnsolved(prev);
    return '🔒 <b>' + esc(level) + '</b> is locked — clear path, no confusion: finish ALL <b>' +
      esc(prev) + '</b> tasks first.' + (next ? ' Start here: select <b>' + esc(next.title) +
      '</b> above, follow its steps, Run + Check.' : ' Reload if you finished them.');
  }
  // Python runner via Pyodide CDN (lazy). Falls back to static checks offline.
  const PY_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
  const PY_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  let _py = null;
  function loadScript(src, ms) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      const to = setTimeout(() => rej(new Error('timeout')), ms || 25000);
      s.src = src; s.onload = () => { clearTimeout(to); res(); }; s.onerror = () => { clearTimeout(to); rej(new Error('cdn')); };
      document.head.appendChild(s);
    });
  }
  async function runPython(code) {
    if (!_py) {
      await loadScript(PY_URL, 25000);
      _py = await loadPyodide({ indexURL: PY_INDEX });
    }
    let out = '';
    _py.setStdout({ batched: (t) => { out += t + '\n'; } });
    _py.setStderr({ batched: (t) => { out += t + '\n'; } });
    _py.runPython(code);
    return out;
  }

  function buildDoc(c) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + c.css +
      '</style></head><body>' + c.html +
      '<script>try{' + c.js + '}catch(e){document.body.insertAdjacentHTML("beforeend", "<pre style=color:red>JS error: "+e.message+"</pre>")}<\/script></body></html>';
  }

  function botSay(who, text) {
    const log = $('askLog');
    const d = document.createElement('div');
    d.style.cssText = 'margin:.4rem 0;font-size:.88rem;line-height:1.55;';
    d.innerHTML = who === 'you' ? '<b>You:</b> ' + esc(text) : '<b>🤖 Bot:</b> ' + text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function answer(q) {
    const s = q.toLowerCase();
    if (s.includes('hint')) {
      const miss = lastResults.find((r) => !r.pass);
      if (!miss) return 'All checks pass — press Check to confirm, your XP is waiting!';
      const h = cur.hints[Math.min(lastResults.filter((r) => !r.pass).length - 1, cur.hints.length - 1)];
      return 'Next failing check: <b>' + esc(miss.desc) + '</b>. Hint: ' + esc(h);
    }
    for (const e of KB) {
      if (e.k.some((k) => s.includes(k))) {
        if (e.a === 'HINT-MODE') {
          const miss = lastResults.find((r) => !r.pass);
          return miss ? 'Failing: <b>' + esc(miss.desc) + '</b> — type exactly what to fix?' : 'Nothing failing right now. Run Check first!';
        }
        return esc(e.a);
      }
    }
    return 'Good question! I know: <b>flex, center, media, click, null, img, form, localStorage, loop, python, typing</b> — or type <b>hint</b> for your current task: <b>' + esc(cur.title) + '</b>.';
  }

  async function runCheck() {
    const c = code[cur.id];
    if (cur.kind === 'py') {
      $('solveVerdict').innerHTML = '<span style="color:var(--muted);font-size:.88rem;">🐍 Running Python (first run downloads it once, ~10s)...</span>';
      try {
        lastPyOut = await runPython(c.py || '');
        showPyOut();
      } catch (e) {
        lastPyOut = '';
        lastResults = cur.checks.filter((ch) => !ch.out).map((ch) => {
          let pass = false;
          try { pass = !!ch.fn(c, null); } catch { pass = false; }
          return { ...ch, pass };
        });
        $('solveVerdict').innerHTML = lastResults.map((r) =>
          '<div style="font-size:.88rem;margin:.25rem 0;">' + (r.pass ? '✅' : '❌') + ' ' + esc(r.desc) + '</div>').join('') +
          '<div style="margin-top:.4rem;color:var(--muted);font-size:.85rem;">⚠️ Python engine needs internet (Pyodide CDN). Code checks above still count — output check skipped.</div>';
        return;
      }
      const norm = lastPyOut.trim().replace(/\s+/g, ' ');
      lastResults = cur.checks.map((ch) => {
        let pass = false;
        try { pass = ch.out ? norm.includes(ch.out) : !!ch.fn(c, null); } catch { pass = false; }
        return { ...ch, pass };
      });
      renderVerdict();
      return;
    }
    runPreview();
    await new Promise((r) => setTimeout(r, 350));
    let doc = null;
    try { doc = $('solvePreview').contentDocument; } catch { doc = null; }
    lastResults = cur.checks.map((ch) => {
      let pass = false;
      try { pass = !!ch.fn(c, doc); } catch { pass = false; }
      return { ...ch, pass };
    });
    renderVerdict();
  }
  function showPyOut() {
    const f = $('solvePreview');
    f.srcdoc = '<!DOCTYPE html><html><body style="margin:0;font-family:Consolas,monospace;background:#0f172a;color:#a7f3d0;padding:1rem;white-space:pre-wrap;">' +
      esc(lastPyOut || '(no output — did you print?)') + '</body></html>';
  }

  function renderVerdict() {
    const v = $('solveVerdict');
    const n = lastResults.filter((r) => r.pass).length, total = lastResults.length;
    $('solveScore').textContent = n + '/' + total + ' checks';
    const all = n === total;
    v.innerHTML = lastResults.map((r) =>
      '<div style="font-size:.88rem;margin:.25rem 0;">' + (r.pass ? '✅' : '❌') + ' ' + esc(r.desc) + '</div>').join('') +
      (all ? '<div style="margin-top:.4rem;font-weight:700;color:#16a34a;">🎉 Correct! XP added to Levels below.</div>'
           : '<div style="margin-top:.4rem;color:var(--muted);font-size:.85rem;">Fix ❌ items, Run again, then Check. Ask “hint” or “why”.</div>');
    const firstMiss = lastResults.find((r) => !r.pass);
    if (firstMiss && !all) {
      try {
        if (window.CDBrain && window.CDBrain.why) v.innerHTML += '<div style="margin-top:.4rem;font-size:.88rem;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:.5rem .7rem;">💡 <b>Why it matters:</b> ' + esc(window.CDBrain.why(firstMiss.id)) + '</div>';
      } catch { /* brain optional */ }
    }
    if (all) {
      const solved = load(LS_SOLVED, {});
      if (!solved[cur.id]) {
        solved[cur.id] = 1; save(LS_SOLVED, solved);
        const done = load(LS_DONE, {});
        if (cur.levelTask && !done[cur.levelTask]) {
          done[cur.levelTask] = 1; save(LS_DONE, done);
          botSay('bot', '🎉 <b>' + esc(cur.title) + '</b> solved! XP saved — reload the page to see it ticked in Levels below.');
        } else {
          botSay('bot', '🎉 <b>' + esc(cur.title) + '</b> solved again! Already counted in Levels.');
        }
    }
    refreshLocks();
    try { if (window.CDLevels && window.CDLevels.refresh) window.CDLevels.refresh(); } catch { /* levels optional */ }
  }
  }

  function addTasks(arr) {
    (arr || []).forEach((t) => { if (t && t.id && !TASKS.some((x) => x.id === t.id)) TASKS.push(t); });
  }
  function openLevel(lt) {
    const t = TASKS.find((x) => x.levelTask === lt) || TASKS[0];
    selectTask(t.id);
    runPreview();
    const s = document.getElementById('solve');
    if (s) s.scrollIntoView({ behavior: 'smooth' });
    else location.hash = '#solve';
  }

  function runPreview() {
    const f = $('solvePreview');
    if (cur.kind === 'py') {
      f.srcdoc = '<!DOCTYPE html><html><body style="margin:0;font-family:Consolas,monospace;background:#0f172a;color:#94a3b8;padding:1rem;">Press Run to execute Python.' +
        (lastPyOut ? '<pre style="color:#a7f3d0;white-space:pre-wrap;">' + esc(lastPyOut) + '</pre>' : '') + '</body></html>';
      return;
    }
    f.srcdoc = buildDoc(code[cur.id]);
  }
  function refreshLocks() {
    const sel = $('solveTask');
    if (!sel) return;
    const keep = cur.id;
    sel.innerHTML = '';
    TASKS.forEach((t) => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = (isUnlocked(t.level) ? '' : '🔒 ') + t.level + ' — ' + t.title;
      sel.appendChild(o);
    });
    sel.value = keep;
    renderPath();
  }
  function renderPath() {
    const el = $('solvePath');
    if (!el) return;
    const s = solvedIds();
    el.innerHTML = ORDER.map((lv) => {
      const tasks = TASKS.filter((t) => t.level === lv);
      const done = tasks.filter((t) => s[t.id]).length;
      const un = isUnlocked(lv);
      const st = done === tasks.length ? 'done' : (un ? 'current' : 'locked');
      const icon = st === 'done' ? '✅' : st === 'current' ? '▶' : '🔒';
      const bg = st === 'done' ? '#dcfce7;border-color:#16a34a;' : st === 'current' ? '#eef2ff;border-color:#4f46e5;' : '#f1f5f9;opacity:.75;';
      return `<button data-lv="${lv}" ${un ? '' : 'disabled'} style="background:${bg}border:1.5px solid var(--border);border-radius:999px;padding:.4rem .9rem;font-size:.8rem;font-weight:700;cursor:${un ? 'pointer' : 'not-allowed'};">${icon} ${lv} ${done}/${tasks.length}</button>`;
    }).join('');
    el.querySelectorAll('[data-lv]').forEach((b) => {
      b.onclick = () => {
        const nx = firstUnsolved(b.dataset.lv) || TASKS.find((t) => t.level === b.dataset.lv);
        if (nx) { selectTask(nx.id); runPreview(); }
      };
    });
  }

  function selectTask(id) {
    const t = TASKS.find((x) => x.id === id) || TASKS[0];
    if (!isUnlocked(t.level)) {
      $('solveTask').value = cur.id;
      botSay('bot', lockMsg(t.level));
      speakReply(lockMsg(t.level));
      return;
    }
    cur = t;
    if (!code[cur.id]) code[cur.id] = { html: '', css: '', js: '', py: '', ...cur.starter };
    $('solveTask').value = cur.id;
    $('solveLevel').textContent = cur.level + (cur.kind === 'py' ? ' 🐍' : '');
    $('solveSteps').innerHTML = '<b>' + esc(cur.title) + ':</b> ' + esc(cur.brief) +
      '<ol style="margin:.4rem 0 0 1.2rem;">' + cur.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>';
    ['html', 'css', 'js', 'py'].forEach((x) => {
      const el = $('code-' + x);
      if (el) { el.value = code[cur.id][x] || ''; el.style.display = x === cur.tab ? 'block' : 'none'; }
      const tb = $('tab-' + x);
      if (tb) tb.style.display = (cur.kind === 'py' ? x === 'py' : x !== 'py') ? '' : 'none';
    });
    showTab(cur.tab);
    lastResults = [];
    $('solveVerdict').innerHTML = '<span style="color:var(--muted);font-size:.88rem;">Press Run, then Check.</span>';
    $('solveScore').textContent = '0/' + cur.checks.length + ' checks';
    renderPath();
  }

  function showTab(t) {
    ['html', 'css', 'js', 'py'].forEach((x) => {
      const el = $('code-' + x), tb = $('tab-' + x);
      if (el) el.style.display = x === t ? 'block' : 'none';
      if (tb) tb.classList.toggle('active', x === t);
    });
  }
  function speakReply(html) {
    try {
      if (window.CDVoice && window.CDVoice.autoSpeak) window.CDVoice.speak(html);
    } catch { /* voice optional */ }
  }

  function init(cfg) {
    const sel = $(cfg.taskSel);
    sel.onchange = () => { saveCode(); selectTask(sel.value); runPreview(); };
    ['html', 'css', 'js', 'py'].forEach((t) => {
      const tb = $('tab-' + t), ed = $('code-' + t);
      if (tb) tb.onclick = () => { saveCode(); showTab(t); };
      if (ed) {
        ed.addEventListener('input', saveCode);
        try { if (window.CDAutocomplete) window.CDAutocomplete.attach(ed, t); } catch { /* optional */ }
      }
    });
    function saveCode() {
      code[cur.id] = code[cur.id] || {};
      ['html', 'css', 'js', 'py'].forEach((t) => {
        const ed = $('code-' + t);
        if (ed) code[cur.id][t] = ed.value;
      });
    }
    $(cfg.runBtn).onclick = () => { saveCode(); cur.kind === 'py' ? runCheckPyOnly() : runPreview(); };
    async function runCheckPyOnly() {
      $('solveVerdict').innerHTML = '<span style="color:var(--muted);font-size:.88rem;">🐍 Running Python...</span>';
      try { lastPyOut = await runPython(code[cur.id].py || ''); showPyOut(); }
      catch { lastPyOut = ''; runPreview(); }
    }
    $(cfg.checkBtn).onclick = () => { saveCode(); runCheck(); };
    $(cfg.resetBtn).onclick = () => { lastPyOut = ''; selectTask(cur.id); runPreview(); };
    $(cfg.askBtn).onclick = () => {
      const q = $(cfg.askInput).value.trim();
      if (!q) return;
      botSay('you', q);
      let a = null;
      try {
        if (window.CDBrain) a = window.CDBrain.ask(q, { task: cur, results: lastResults, code: code[cur.id] });
      } catch { a = null; }
      if (!a) a = answer(q);
      botSay('bot', a);
      speakReply(a);
      $(cfg.askInput).value = '';
    };
    $(cfg.askInput).addEventListener('keydown', (e) => { if (e.key === 'Enter') $(cfg.askBtn).click(); });
    // voice: mic + speaker toggle (optional, guarded)
    if (cfg.micBtn && $(cfg.micBtn)) {
      $(cfg.micBtn).onclick = () => {
        if (!window.CDVoice || !window.CDVoice.supported) {
          botSay('bot', '🎤 Voice input needs Chrome/Edge. Type your question instead — I read everything!');
          return;
        }
        $(cfg.micBtn).textContent = '🔴...';
        window.CDVoice.listen(
          (text) => { $(cfg.micBtn).textContent = '🎤'; $(cfg.askInput).value = text; $(cfg.askBtn).click(); },
          () => { $(cfg.micBtn).textContent = '🎤'; botSay('bot', '🎤 I did not catch that — check mic permission and try again.'); }
        );
      };
    }
    if (cfg.voiceBtn && $(cfg.voiceBtn)) {
      const vb = $(cfg.voiceBtn);
      const paint = () => { vb.textContent = window.CDVoice && window.CDVoice.autoSpeak ? '🔊' : '🔇'; };
      vb.onclick = () => {
        if (!window.CDVoice || !window.CDVoice.tts) { botSay('bot', '🔊 Voice replies need Chrome/Edge. My text answers still work!'); return; }
        window.CDVoice.autoSpeak = !window.CDVoice.autoSpeak;
        paint();
        if (window.CDVoice.autoSpeak) window.CDVoice.speak('Voice replies on!');
      };
      paint();
    }
    refreshLocks();
    selectTask(TASKS[0].id);
    runPreview();
    botSay('bot', 'Welcome to Solver Lab! Path: <b>HTML → CSS → JavaScript → Python</b>. Start with task 1, press <b>Run</b> then <b>Check</b>. Type to get VS Code-style hints, or ask me — try “how do I center a div?”');
  }

  return { init, openLevel, addTasks };
})();
