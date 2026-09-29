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
      brief: 'Make a small profile card: a name heading, a photo, and a link.',
      steps: ['1. Add an <h1> with any name.', '2. Add an <img> with src and alt.', '3. Add an <a> link with an href (https://...).', 'Press Run to preview, then Check.'],
      starter: { html: '<h1>Your Name</h1>\n<!-- add img + link here -->', css: '', js: '' }, tab: 'html',
      checks: [
        { id: 'h1', desc: 'Has an <h1> heading', fn: (c, d) => has(c.html, /<h1[\s>]/i) && !!(d && d.querySelector('h1')) },
        { id: 'img', desc: 'Has <img> with src + alt', fn: (c) => has(c.html, /<img[^>]*src=/i) && has(c.html, /<img[^>]*alt=/i) },
        { id: 'a', desc: 'Has <a> link with href', fn: (c, d) => has(c.html, /<a[^>]*href=/i) && !!(d && d.querySelector('a[href]')) } ],
      hints: ['Start with <h1>Dipen</h1>.', 'Image: <img src="https://via.placeholder.com/150" alt="photo">.', 'Link: <a href="https://github.com">My GitHub</a>.'] },
    { id: 'solve-h2', level: 'HTML', levelTask: 'h2', title: 'Contact form',
      brief: 'Build a form with name, email and a submit button. Email must validate.',
      steps: ['1. Wrap inputs in a <form>.', '2. Add text input for name with required.', '3. Add <input type="email" required>.', '4. Add a <button type="submit">.'],
      starter: { html: '<form>\n  <!-- name + email + button -->\n</form>', css: '', js: '' }, tab: 'html',
      checks: [
        { id: 'form', desc: 'Inputs wrapped in <form>', fn: (c) => has(c.html, /<form[\s>]/i) },
        { id: 'email', desc: 'Email input with type=email + required', fn: (c) => has(c.html, /<input[^>]*type=["']email["']/i) && has(c.html, /required/i) },
        { id: 'btn', desc: 'Submit button present', fn: (c, d) => has(c.html, /<button[^>]*type=["']submit["']/i) || !!(d && d.querySelector('button')) } ],
      hints: ['<input type="text" placeholder="Name" required>.', '<input type="email" placeholder="Email" required>.', '<button type="submit">Send</button>.'] },
    { id: 'solve-c1', level: 'CSS', levelTask: 'c1', title: 'Flexbox navbar',
      brief: 'Turn plain links into a horizontal navbar using flexbox.',
      steps: ['1. HTML: a <nav> with 3 links (already given).', '2. CSS: nav { display: flex; }.', '3. Add gap + justify-content: space-between.', '4. Style links: no underline, bold.'],
      starter: { html: '<nav>\n  <a href="#">Home</a>\n  <a href="#">Game</a>\n  <a href="#">Contact</a>\n</nav>', css: '/* style nav + a here */', js: '' }, tab: 'css',
      checks: [
        { id: 'flex', desc: 'nav uses display: flex', fn: (c) => has(c.css, /display\s*:\s*flex/i) },
        { id: 'gap', desc: 'Uses gap or justify-content', fn: (c) => has(c.css, /gap\s*:/i) || has(c.css, /justify-content\s*:/i) },
        { id: 'links', desc: 'Links styled (no underline)', fn: (c) => has(c.css, /text-decoration\s*:\s*none/i) } ],
      hints: ['nav { display: flex; gap: 1rem; justify-content: space-between; }', 'nav a { text-decoration: none; font-weight: bold; }', 'Give nav a background + padding.'] },
    { id: 'solve-c2', level: 'CSS', levelTask: 'c3', title: 'Responsive box',
      brief: 'A box that is wide on desktop but full-width on phones.',
      steps: ['1. HTML: <div class="box">Hello</div> (given).', '2. CSS: .box width 400px + background.', '3. Add @media (max-width: 600px) making .box width 100%.'],
      starter: { html: '<div class="box">Hello</div>', css: '.box {\n  /* width + background */\n}', js: '' }, tab: 'css',
      checks: [
        { id: 'box', desc: '.box has width + background', fn: (c) => has(c.css, /\.box/i) && has(c.css, /width\s*:/i) && has(c.css, /background/i) },
        { id: 'media', desc: 'Has @media (max-width: 600px)', fn: (c) => has(c.css, /@media[^{]*max-width\s*:\s*600px/i) },
        { id: 'live', desc: 'Preview shows the box', fn: (c, d) => !!(d && d.querySelector('.box')) } ],
      hints: ['.box { width: 400px; background: #4f46e5; color: white; padding: 2rem; }', '@media (max-width: 600px) { .box { width: 100%; } }', 'Press Run first — live checks need the preview.'] },
    { id: 'solve-j1', level: 'JavaScript', levelTask: 'j1', title: 'Click counter',
      brief: 'A number + button. Each click adds 1. Bot clicks it for real to verify!',
      steps: ['1. HTML given: span#count (0) + button#plus.', '2. JS: get both elements.', '3. addEventListener click → read number, +1, write back.'],
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
      brief: 'Type text, press Add → it appears in the list and survives reload.',
      steps: ['1. HTML given: input#todo + button#add + ul#list.', '2. JS: on click, createElement li with input value, appendChild to ul.', '3. Save array to localStorage, load on start (bonus).'],
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
      hints: ['document.getElementById("add").addEventListener("click", () => { ... });', 'const li = document.createElement("li"); li.textContent = input.value; list.appendChild(li);', 'Bonus: localStorage.setItem("todos", JSON.stringify([...])).'] }
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
    { k: ['iframe', 'embed', 'game'], a: 'Embed a page: <iframe src="CD-first/index.html" style="width:100%;height:700px;border:0"></iframe>. Same-folder relative paths work on file:// too.' },
    { k: ['what to do', 'instruction', 'task', 'start', 'stuck'], a: 'Read the 3–4 numbered steps above the editor, press Run to see your preview, then Check. Failing checks turn into exact hints — ask me "hint".' },
    { k: ['hint'], a: 'HINT-MODE' },
    { k: ['hello', 'hi', 'hey', 'namaste'], a: 'Hello! I am the Solver bot. Pick a task, write code, press Check — or ask me about flex, media queries, clicks, forms, localStorage.' }
  ];

  let cur = TASKS[0], code = {}, lastResults = [];
  const $ = (id) => document.getElementById(id);

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
    return 'Good question! I know: <b>flex, center, media/responsive, click, null errors, img, form, localStorage, loop, iframe</b> — or type <b>hint</b> for your current task: <b>' + esc(cur.title) + '</b>.';
  }

  async function runCheck() {
    runPreview();
    await new Promise((r) => setTimeout(r, 350));
    let doc = null;
    try { doc = $('solvePreview').contentDocument; } catch { doc = null; }
    const c = code[cur.id];
    lastResults = cur.checks.map((ch) => {
      let pass = false;
      try { pass = !!ch.fn(c, doc); } catch { pass = false; }
      return { ...ch, pass };
    });
    renderVerdict();
  }

  function renderVerdict() {
    const v = $('solveVerdict');
    const n = lastResults.filter((r) => r.pass).length, total = lastResults.length;
    $('solveScore').textContent = n + '/' + total + ' checks';
    const all = n === total;
    v.innerHTML = lastResults.map((r) =>
      '<div style="font-size:.88rem;margin:.25rem 0;">' + (r.pass ? '✅' : '❌') + ' ' + esc(r.desc) + '</div>').join('') +
      (all ? '<div style="margin-top:.4rem;font-weight:700;color:#16a34a;">🎉 Correct! XP added to Levels below.</div>'
           : '<div style="margin-top:.4rem;color:var(--muted);font-size:.85rem;">Fix ❌ items, Run again, then Check. Type “hint” to the bot.</div>');
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
    }
  }

  function runPreview() {
    const f = $('solvePreview');
    f.srcdoc = buildDoc(code[cur.id]);
  }

  function selectTask(id) {
    cur = TASKS.find((t) => t.id === id) || TASKS[0];
    if (!code[cur.id]) code[cur.id] = { ...cur.starter };
    $('solveTask').value = cur.id;
    $('solveLevel').textContent = cur.level;
    $('solveSteps').innerHTML = '<b>' + esc(cur.title) + ':</b> ' + esc(cur.brief) +
      '<ol style="margin:.4rem 0 0 1.2rem;">' + cur.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>';
    ['html', 'css', 'js'].forEach((t) => { $('code-' + t).value = code[cur.id][t]; });
    showTab(cur.tab);
    lastResults = [];
    $('solveVerdict').innerHTML = '<span style="color:var(--muted);font-size:.88rem;">Press Run, then Check.</span>';
    $('solveScore').textContent = '0/' + cur.checks.length + ' checks';
  }

  function showTab(t) {
    ['html', 'css', 'js'].forEach((x) => {
      $('code-' + x).style.display = x === t ? 'block' : 'none';
      $('tab-' + x).classList.toggle('active', x === t);
    });
  }

  function init(cfg) {
    const sel = $(cfg.taskSel);
    TASKS.forEach((t) => {
      const o = document.createElement('option');
      o.value = t.id; o.textContent = t.level + ' — ' + t.title;
      sel.appendChild(o);
    });
    sel.onchange = () => { saveCode(); selectTask(sel.value); runPreview(); };
    ['html', 'css', 'js'].forEach((t) => {
      $('tab-' + t).onclick = () => { saveCode(); showTab(t); };
      $('code-' + t).addEventListener('input', saveCode);
    });
    function saveCode() {
      code[cur.id] = { html: $('code-html').value, css: $('code-css').value, js: $('code-js').value };
    }
    $(cfg.runBtn).onclick = () => { saveCode(); runPreview(); };
    $(cfg.checkBtn).onclick = () => { saveCode(); runCheck(); };
    $(cfg.resetBtn).onclick = () => selectTask(cur.id);
    $(cfg.askBtn).onclick = () => {
      const q = $(cfg.askInput).value.trim();
      if (!q) return;
      botSay('you', q);
      botSay('bot', answer(q));
      $(cfg.askInput).value = '';
    };
    $(cfg.askInput).addEventListener('keydown', (e) => { if (e.key === 'Enter') $(cfg.askBtn).click(); });
    selectTask(TASKS[0].id);
    runPreview();
    botSay('bot', 'Welcome to Solver Lab! Pick a task above, follow the steps, press <b>Run</b> then <b>Check</b>. Ask me anything — try “how do I center a div?”');
  }

  return { init };
})();
