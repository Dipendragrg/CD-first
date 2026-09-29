// CD-first shared Levels + Project-submit system (no backend, localStorage only).
// Used by portfolio index.html via <script src="CD-first/levels-submit.js">.
// Works on file:// and http://localhost:3000/ — no server needed.
window.CDLevels = (() => {
  const LEVELS = [
    { id: 'html', name: 'HTML', color: '#f97316', tasks: [
      { id: 'h1', t: 'Build a page with headings, paragraphs, links, images', xp: 10 },
      { id: 'h2', t: 'Create a form (name, email, message) with validation', xp: 10 },
      { id: 'h3', t: 'Make a table (e.g. scoreboard) with thead/tbody', xp: 10 },
      { id: 'h4', t: 'Use semantic tags: header, nav, main, section, footer', xp: 10 },
      { id: 'h5', t: 'Embed the Cube Arena game in an iframe section', xp: 10 } ] },
    { id: 'css', name: 'CSS', color: '#38bdf8', tasks: [
      { id: 'c1', t: 'Style a navbar with flexbox (like this portfolio)', xp: 15 },
      { id: 'c2', t: 'Build a 3-card grid with hover effects', xp: 15 },
      { id: 'c3', t: 'Make the page responsive with a media query', xp: 15 },
      { id: 'c4', t: 'Add a button animation / transition', xp: 15 },
      { id: 'c5', t: 'Recolor the arena HUD in style.css', xp: 15 } ] },
    { id: 'js', name: 'JavaScript', color: '#facc15', tasks: [
      { id: 'j1', t: 'Counter app: + / - buttons update the DOM', xp: 20 },
      { id: 'j2', t: 'Todo list saved in localStorage', xp: 20 },
      { id: 'j3', t: 'Fetch JSON (e.g. TASKS.md/health) and render it', xp: 20 },
      { id: 'j4', t: 'Form validation with error messages', xp: 20 },
      { id: 'j5', t: 'Change bot speed in client.js moveBot()', xp: 20 } ] },
    { id: 'three', name: 'Three.js / Game', color: '#a78bfa', tasks: [
      { id: 't1', t: 'Run the arena and win a 90s round', xp: 25 },
      { id: 't2', t: 'Change cube COLORS in client.js', xp: 25 },
      { id: 't3', t: 'Add +5 orbs in startGame()', xp: 25 },
      { id: 't4', t: 'Add a 5th bot player', xp: 25 },
      { id: 't5', t: 'Submit your game tweak as a project below', xp: 25 } ] }
  ];
  const LS_TASKS = 'cd-levels-v1', LS_PROJ = 'cd-projects-v1';
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function badge(xp) {
    if (xp >= 450) return '🏆 Arena Master';
    if (xp >= 250) return '🥈 Developer';
    if (xp >= 100) return '🥉 Builder';
    return '🌱 Rookie';
  }

  function renderLevels(root, xpEl, badgeEl) {
    const done = load(LS_TASKS, {});
    root.innerHTML = '';
    let xp = 0, total = 0;
    LEVELS.forEach((lv) => {
      const card = document.createElement('div');
      card.className = 'card';
      const lDone = lv.tasks.filter((t) => done[t.id]).length;
      const lXp = lv.tasks.filter((t) => done[t.id]).reduce((a, t) => a + t.xp, 0);
      const lMax = lv.tasks.reduce((a, t) => a + t.xp, 0);
      xp += lXp; total += lMax;
      const pct = Math.round((lDone / lv.tasks.length) * 100);
      card.innerHTML = `<h4><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${lv.color};margin-right:.4rem;"></span>${esc(lv.name)} <span class="tag">${lDone}/${lv.tasks.length}</span> <span class="tag">${lXp}/${lMax} XP</span></h4>
        <div class="bar" style="margin:.6rem 0;"><div class="bar-fill" style="width:${pct}%"></div></div>
        ${lv.tasks.map((t) => `<label style="display:flex;gap:.5rem;align-items:flex-start;font-size:.92rem;margin:.35rem 0;cursor:pointer;color:var(--muted);">
          <input type="checkbox" data-task="${t.id}" ${done[t.id] ? 'checked' : ''} style="margin-top:.25rem;" />
          <span>${esc(t.t)} <b style="color:var(--text);">+${t.xp}</b></span></label>`).join('')}`;
      root.appendChild(card);
    });
    root.querySelectorAll('input[data-task]').forEach((cb) => {
      cb.onchange = () => {
        const d = load(LS_TASKS, {});
        if (cb.checked) d[cb.dataset.task] = 1; else delete d[cb.dataset.task];
        save(LS_TASKS, d);
        renderLevels(root, xpEl, badgeEl);
      };
    });
    if (xpEl) xpEl.textContent = `${xp} / ${total} XP`;
    if (badgeEl) badgeEl.textContent = badge(xp);
  }

  function renderProjects(listEl, countEl, filter) {
    const all = load(LS_PROJ, []);
    const items = filter === 'all' ? all : all.filter((p) => p.level === filter);
    if (countEl) countEl.textContent = `${all.length} submitted`;
    listEl.innerHTML = items.length ? '' : '<p style="color:var(--muted);font-size:.9rem;">No projects yet — submit yours above!</p>';
    [...items].reverse().forEach((p) => {
      const d = document.createElement('div');
      d.className = 'card';
      d.innerHTML = `<h4>${esc(p.title)} <span class="tag">${esc(p.level)}</span></h4>
        <p style="font-size:.88rem;">by <b>${esc(p.name)}</b> · ${esc(new Date(p.ts).toLocaleDateString())}</p>
        ${p.desc ? `<p style="font-size:.9rem;">${esc(p.desc)}</p>` : ''}
        ${p.link ? `<a href="${esc(p.link)}" target="_blank" style="color:var(--accent);font-weight:600;font-size:.88rem;">Open project →</a>` : ''}
        ${p.code ? `<pre style="background:var(--light);border:1px solid var(--border);border-radius:8px;padding:.6rem;overflow:auto;font-size:.78rem;margin-top:.5rem;">${esc(p.code.slice(0, 800))}</pre>` : ''}
        <br /><button data-del="${p.id}" style="margin-top:.5rem;background:white;color:var(--text);border:1.5px solid var(--border);padding:.4rem .9rem;font-size:.8rem;">Delete</button>`;
      listEl.appendChild(d);
    });
    listEl.querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = () => {
        save(LS_PROJ, load(LS_PROJ, []).filter((p) => String(p.id) !== b.dataset.del));
        renderProjects(listEl, countEl, currentFilter(filter));
      };
    });
  }
  function currentFilter(f) {
    const el = document.querySelector('[data-projfilter].active');
    return el ? el.dataset.projfilter : f;
  }

  function init(cfg) {
    const root = document.getElementById(cfg.levelsRoot);
    const xpEl = document.getElementById(cfg.xpEl);
    const badgeEl = document.getElementById(cfg.badgeEl);
    const form = document.getElementById(cfg.formId);
    const listEl = document.getElementById(cfg.listEl);
    const countEl = document.getElementById(cfg.countEl);
    if (!root || !form || !listEl) return;
    renderLevels(root, xpEl, badgeEl);
    let filter = 'all';
    const setFilter = (f) => {
      filter = f;
      document.querySelectorAll('[data-projfilter]').forEach((b) => b.classList.toggle('active', b.dataset.projfilter === f));
      renderProjects(listEl, countEl, filter);
    };
    document.querySelectorAll('[data-projfilter]').forEach((b) => {
      b.style.cssText += ';background:white;color:var(--text);border:1.5px solid var(--border);padding:.4rem .9rem;font-size:.8rem;';
      b.onclick = () => setFilter(b.dataset.projfilter);
    });
    const activeBtn = document.querySelector('[data-projfilter="all"]');
    if (activeBtn) activeBtn.classList.add('active');
    renderProjects(listEl, countEl, filter);
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      if (!v(cfg.fTitle) || !v(cfg.fName)) { alert('Add your name + project title.'); return; }
      const all = load(LS_PROJ, []);
      all.push({ id: Date.now(), ts: Date.now(), name: v(cfg.fName), level: v(cfg.fLevel),
        title: v(cfg.fTitle), desc: v(cfg.fDesc), link: v(cfg.fLink), code: v(cfg.fCode) });
      save(LS_PROJ, all);
      form.reset();
      renderProjects(listEl, countEl, filter);
      alert('Project submitted! It is saved in this browser.');
    };
    const exp = document.getElementById(cfg.expBtn);
    if (exp) exp.onclick = () => {
      const blob = new Blob([JSON.stringify({ tasks: load(LS_TASKS, {}), projects: load(LS_PROJ, []) }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cd-first-progress.json';
      a.click();
    };
    const imp = document.getElementById(cfg.impInput);
    if (imp) imp.onchange = () => {
      const f = imp.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const j = JSON.parse(r.result);
          if (j.tasks) save(LS_TASKS, j.tasks);
          if (j.projects) save(LS_PROJ, j.projects);
          renderLevels(root, xpEl, badgeEl);
          renderProjects(listEl, countEl, filter);
          alert('Progress imported!');
        } catch { alert('Invalid file.'); }
      };
      r.readAsText(f);
    };
  }
  return { init, LEVELS };
})();
