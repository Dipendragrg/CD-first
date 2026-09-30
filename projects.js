// Guided project builds: bigger multi-check builds solved in the Solver Lab editor.
// Registered via CDSolver.addTasks BEFORE CDSolver.init (see index.html init order).
// XP lands on existing Levels tasks; unlock order (HTML→CSS→JS→Python) is respected.
window.CDProjects = (() => {
  const has = (code, re) => re.test(code);
  const BUILDS = [
    { id: 'solve-b1', level: 'HTML', levelTask: 'h3', title: 'Build: scoreboard table',
      brief: 'A real mini-project: a cricket scoreboard table with head + body rows.',
      steps: ['1. <table> wrapper.', '2. <thead> with one <tr> of <th> cells (Player, Runs).', '3. <tbody> with 3+ <tr> rows of <td> cells.', 'Run + Check.'],
      starter: { html: '<table>\n  <!-- thead + tbody here -->\n</table>', css: '', js: '' }, tab: 'html',
      checks: [
        { id: 't', desc: 'Has <table>', fn: (c) => has(c.html, /<table[\s>]/i) },
        { id: 'h', desc: '<thead> with <th> cells', fn: (c) => has(c.html, /<thead[\s>]/i) && has(c.html, /<th[\s>]/i) },
        { id: 'b', desc: '<tbody> with 3+ rows', fn: (c, d) => has(c.html, /<tbody[\s>]/i) && (!d || d.querySelectorAll('tbody tr').length >= 3 || (c.html.match(/<tr[\s>]/gi) || []).length >= 4) } ],
      hints: ['<thead><tr><th>Player</th><th>Runs</th></tr></thead>', '<tbody><tr><td>Ram</td><td>45</td></tr> ... 3 rows ...</tbody>', 'Count: 1 head row + 3 body rows = 4 <tr>.'] },
    { id: 'solve-b2', level: 'CSS', levelTask: 'c2', title: 'Build: 3-card grid',
      brief: 'Style 3 plain boxes into a responsive card grid with hover.',
      steps: ['1. HTML given: 3 × div.card in div.grid.', '2. .grid { display: grid; 3 columns + gap }.', '3. Cards: padding + background + radius.', '4. .card:hover lift.'],
      starter: { html: '<div class="grid">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>', css: '/* grid + cards + hover */', js: '' }, tab: 'css',
      checks: [
        { id: 'g', desc: '.grid uses display: grid', fn: (c) => has(c.css, /display\s*:\s*grid/i) },
        { id: 'c', desc: '3 columns + gap', fn: (c) => has(c.css, /grid-template-columns\s*:/i) && has(c.css, /gap\s*:/i) },
        { id: 'h', desc: '.card:hover exists', fn: (c) => has(c.css, /\.card\s*:\s*hover/i) } ],
      hints: ['.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }', '.card { background: white; padding: 1.5rem; border-radius: 12px; }', '.card:hover { transform: translateY(-4px); }'] },
    { id: 'solve-b3', level: 'JavaScript', levelTask: 'j4', title: 'Build: validated form',
      brief: 'Stop bad submits: name needs 2+ letters, error shows in red.',
      steps: ['1. HTML given: form#vform, input#vname, p#verr, button.', '2. On submit: preventDefault().', '3. If name < 2 chars → error text, else clear it.'],
      starter: { html: '<form id="vform">\n  <input id="vname" placeholder="Name">\n  <p id="verr" style="color:red"></p>\n  <button>Send</button>\n</form>', css: '', js: '// validate on submit' }, tab: 'js',
      checks: [
        { id: 'p', desc: 'Listens submit + prevents it', fn: (c) => has(c.js, /addEventListener\s*\(\s*['"]submit['"]/i) && has(c.js, /preventDefault\s*\(\s*\)/i) },
        { id: 'l', desc: 'Checks name length', fn: (c) => has(c.js, /length\s*<\s*2|length\s*>=\s*2/i) },
        { id: 'live', desc: 'LIVE: short name shows error', fn: (c, d) => {
          try {
            if (!d) return false;
            const f = d.querySelector('#vform'), n = d.querySelector('#vname'), e = d.querySelector('#verr');
            if (!f || !n || !e) return false;
            n.value = 'x'; f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return e.textContent.trim().length > 0;
          } catch { return false; } } } ],
      hints: ['document.getElementById("vform").addEventListener("submit", (e) => { e.preventDefault(); ... });', 'if (name.value.trim().length < 2) err.textContent = "Too short!"; else err.textContent = "";', 'The LIVE check submits with 1 letter — error must appear.'] },
    { id: 'solve-b4', level: 'Python', levelTask: 'p2', title: 'Build: bill splitter',
      brief: 'A shop bill: price 120 × qty 3, split 3 ways. Print it nicely with an f-string.',
      steps: ['1. price = 120, qty = 3.', '2. total = price * qty; each = total / 3.', '3. print(f"Each pays {each}") → Each pays 120.0.'],
      starter: { html: '', css: '', js: '', py: 'price = 120\nqty = 3\n# total, each, print f-string' }, tab: 'py', kind: 'py', expected: '120',
      checks: [
        { id: 'm', desc: 'Multiplies price * qty', fn: (c) => has(c.py, /price\s*\*\s*qty|qty\s*\*\s*price/i) },
        { id: 'f', desc: 'Uses f-string print', fn: (c) => has(c.py, /print\s*\(\s*f["']/i) },
        { id: 'out', desc: 'Output contains 120', out: '120' } ],
      hints: ['total = price * qty', 'each = total / 3', 'print(f"Each pays {each}")'] }
  ];
  function init() {
    try { if (window.CDSolver && window.CDSolver.addTasks) window.CDSolver.addTasks(BUILDS); } catch { /* solver optional */ }
  }
  return { init, BUILDS };
})();
