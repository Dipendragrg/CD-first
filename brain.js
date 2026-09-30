// Solver bot brain: analyzes YOUR code, plans step-by-step fixes, defines terms,
// explains WHY each rule is correct. No keyword-only replies. Offline, no keys.
window.CDBrain = (() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // concept: [definition, why-it-matters, example]
  const CONCEPTS = {
    'tag': ['A label that marks content: <h1>Hi</h1> = "this is a heading".', 'The browser only shows what tags describe — no tag, no content.', '<p>, <a>, <img>'],
    'element': ['A full unit: opening tag + content + closing tag.', 'Pages are trees of elements; JS finds and changes them.', '<h1>Dipen</h1>'],
    'attribute': ['Extra info inside a tag: name="value".', 'href/src/alt/type all ride in attributes.', '<a href="...">, <img src alt>'],
    'heading': ['<h1> biggest … <h6> smallest. One <h1> per page.', 'Structure for humans + screen readers + search.', '<h1>My name</h1>'],
    'link': ['<a href="address">words</a> — clickable jump.', 'href = where. No href = dead link.', '<a href="https://x.com">X</a>'],
    'image': ['<img src="file" alt="words">. No closing tag.', 'alt shows if the file breaks + read by screen readers.', '<img src="me.png" alt="me">'],
    'form': ['<form> wraps inputs + a submit button into one sendable unit.', 'Submit gathers every input at once.', '<form>…<button>Send</button></form>'],
    'input': ['A field users type in. type picks the keyboard + checks.', 'type="email" validates free; required blocks empty submits.', '<input type="email" required>'],
    'button': ['Clickable trigger. Inside a form, type="submit" sends it.', 'Outside forms it does nothing until JS listens.', '<button>Send</button>'],
    'table': ['Rows of data: <table> → <thead>/<tbody> → <tr> → <th>/<td>.', 'thead = header row, tbody = data rows, th = bold header cell.', '<th>Name</th> vs <td>Ram</td>'],
    'css': ['Paint rules for HTML: selector { property: value; }.', 'One file can repaint a whole site without touching HTML.', 'h1 { color: red; }'],
    'selector': ['The "who" of a rule: tag, .class, or #id.', 'Wrong selector = rule paints nothing. Match exactly.', 'nav { } .card { } #count { }'],
    'class': ['A reusable label: class="card" + .card { }.', 'Many elements can share one class = style once.', '<div class="card"> + .card{}'],
    'flexbox': ['display:flex lays children in a row (or column).', 'Navbars, button rows, centering — one line does it.', 'nav { display:flex; gap:1rem; }'],
    'grid': ['display:grid lays children in rows AND columns.', 'Card galleries: grid-template-columns: 1fr 1fr 1fr.', '.grid { display:grid; gap:1rem; }'],
    'media query': ['@media (max-width:600px){ } = "only on small screens".', 'One page fits phones + laptops. Put after desktop rules.', '@media (max-width:600px){.box{width:100%}}'],
    'responsive': ['Page reshapes for any screen width.', 'Half your visitors are on phones.', 'flex-wrap + media queries'],
    'hover': ['.x:hover = style while the mouse is over it.', 'Makes buttons/cards feel alive and clickable.', '.card:hover { transform:translateY(-4px); }'],
    'javascript': ['The muscles: finds elements, reacts to clicks, changes the page live.', 'Runs AFTER the HTML exists, top to bottom.', '<script>…</script> at page end'],
    'variable': ['A named box: const out = ... (const never re-points).', 'Grab an element ONCE, reuse it everywhere.', 'const b = document.getElementById("plus");'],
    'dom': ['The live tree of elements JS can touch (Document Object Model).', 'Every getElementById/querySelector reaches into it.', 'document.querySelector("#count")'],
    'event': ['Something that happens: click, submit, input.', 'Code sleeps until its event fires.', '"click", "submit", "input"'],
    'listener': ['"When X happens, run this": el.addEventListener("click", fn).', 'Buttons do nothing without one.', 'b.addEventListener("click", () => {...})'],
    'function': ['A packed reusable action: function name(){ }.', 'Write once, call anywhere — no copy-paste.', 'function add(){ count++; }'],
    'loop': ['Repeat: for (init; cond; step) or for..of / forEach.', '10 rows from 3 lines instead of 30.', 'for (let i=0;i<5;i++)'],
    'array': ['An ordered list: [1,2,3]. Starts at index 0.', 'Lists + loops render todo items, scores, cards.', 'items.forEach(...)'],
    'string': ['Text in quotes: "hi". Numbers in quotes are NOT numbers.', '"5"+1 = "51" but 5+1 = 6 — use Number().', 'Number(out.textContent)+1'],
    'localstorage': ['Browser mini-database: strings only, survives reload.', 'Save todos/scores; JSON converts arrays.', 'setItem("k", JSON.stringify(arr))'],
    'json': ['Text format for data: {"a":1}. Bridge to localStorage/fetch.', 'stringify to save, parse to load.', 'JSON.parse(localStorage.getItem("k")||"[]")'],
    'null': ['"Found nothing". getElementById with a wrong id gives null.', 'Check id spelling + that HTML exists before the script.', 'id="count" vs getElementById("Count")'],
    'python': ['Runs line-by-line in an interpreter, not a browser.', 'print shows, variables store, indent groups.', 'print("Hi")'],
    'print': ['Shows text: print("Hi", name). Parentheses required.', 'No output? You forgot print — computing is not showing.', 'print(total)'],
    'indent': ['Leading spaces group lines under def/for/if.', 'Wrong spaces = crash. Never mix tabs and spaces.', '    total = total + i'],
    'def': ['Defines a reusable action: def greet(name): + indented body.', 'Define once, call many times: greet("Ram").', 'def greet(n): print("Hi",n)'],
    'range': ['range(1,6) = 1..5 (end excluded).', 'Off-by-one errors live here — end is NOT included.', 'for i in range(1,6):'],
    'f-string': ['f"Hi {name}" injects variables into text.', 'Cleaner than "Hi "+name and avoids type bugs.', 'print(f"Each pays {each}")'],
    'contrast': ['Text vs background difference, ratio like 7:1.', 'Below 4.5:1 body text is unreadable for many.', 'Dark #0f172a on white = 15:1'],
    'wpm': ['Words per minute: (correct chars ÷ 5) ÷ minutes.', 'Accuracy first — speed follows. 80%+ saves best.', '40 WPM at 95% beats 60 at 70%'],
    'iframe': ['A window showing another page inside yours.', 'src = which page. Same-folder paths work offline.', '<iframe src="typing-hub.html">']
  };
  const ALIAS = { html: 'tag', css: 'css', js: 'javascript', py: 'python', click: 'listener', submit: 'form', email: 'input', img: 'image', anchor: 'link', ul: 'table', div: 'element', span: 'element', nav: 'flexbox', row: 'flexbox', column: 'grid', mobile: 'media query', phone: 'media query', var: 'variable', const: 'variable', let: 'variable', id: 'dom', queryselector: 'dom', todo: 'localstorage', save: 'localstorage', remember: 'localstorage', reload: 'localstorage', number: 'string', text: 'string', for: 'loop', each: 'loop', list: 'array', dict: 'json', data: 'json', error: 'null', undefined: 'null', found: 'null', loop_: 'range', sum: 'range', hello: 'print', name_: 'variable', speak: 'listener', mic: 'listener' };
  // why each check rule is correct, keyed by check id
  const WHY = {
    h1: 'One main heading tells humans AND screen readers what the page is.',
    img: 'alt text shows when the image breaks and is read aloud to blind users.',
    a: 'A link without href goes nowhere — href IS the destination.',
    form: 'The form collects every input at once on submit.',
    email: 'type=email gives free validation; required blocks empty submits.',
    btn: 'No submit button = no way to send the form.',
    flex: 'display:flex turns stacked links into a real navbar row.',
    gap: 'gap/justify-content spaces items evenly — no fiddly margins.',
    links: 'Underlined blue links look 1999; nav links get styled.',
    box: 'Width + background make the box visible and measurable.',
    media: 'Without it phones get the desktop layout — broken on mobile.',
    live: 'Seeing it run proves the code works, not just looks right.',
    sel: 'You must grab elements before changing them — names must match exactly.',
    lis: 'No listener = dead button. Events are how pages react.',
    create: 'createElement builds real nodes the browser renders.',
    append: 'Created but not appended = invisible. Append puts it on stage.',
    var: 'Named boxes beat magic values scattered everywhere.',
    print: 'Computing without print shows nothing — print IS the output.',
    out: 'Exact output match proves the program truly ran correctly.',
    for: 'range() generates the sequence; the loop repeats the work.',
    add: 'total = total + i accumulates — the heart of every sum.',
    def: 'def packs reusable logic; one definition, many calls.',
    call: 'Defining without calling runs nothing — call it to execute.',
    t: 'Tables need the <table> wrapper or rows render as plain text.',
    h: 'Header cells (<th>) label columns; reviewers read them first.',
    b: 'tbody rows ARE the data — 3+ proves the pattern, not a fluke.',
    g: 'display:grid creates real columns; floats are history.',
    c: 'Columns + gap = gallery. Missing either collapses the layout.',
    p: 'preventDefault stops the page reload that would wipe your check.',
    l: 'Length rules are validation: too-short input must be rejected.',
    m: 'price × qty is the total — the business logic in one line.',
    f: 'f-strings inject numbers into messages cleanly, no plus-mess.'
  };
  function conceptOf(q) {
    const s = q.toLowerCase().replace(/[^a-z0-9#+ ]/g, ' ');
    for (const k of Object.keys(CONCEPTS)) {
      if (s.includes(k)) return k;
    }
    for (const w of s.split(/\s+/)) {
      if (CONCEPTS[w]) return w;
      if (ALIAS[w] && CONCEPTS[ALIAS[w]]) return ALIAS[w];
    }
    return null;
  }
  function card(k) {
    const c = CONCEPTS[k];
    return '<b>📖 ' + k + ':</b> ' + c[0] + '<br>💡 <b>Why:</b> ' + c[1] + '<br>✍️ <b>Try:</b> <code>' + c[2].replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</code>';
  }
  // task-specific code analysis: returns findings [{ok, title, detail}]
  function analyze(task, code) {
    const out = [];
    const c = code || { html: '', css: '', js: '', py: '' };
    const push = (ok, title, detail) => { if (out.length < 4) out.push({ ok, title, detail }); };
    if (!((c.html || '') + (c.css || '') + (c.js || '') + (c.py || '')).trim()) {
      return [{ ok: false, title: 'Editor is empty', detail: 'Nothing to analyze yet. Type the starter lines from the steps above, press Run, then ask me again.' }];
    }
    const id = task.id;
    if (id === 'solve-h1' || id === 'solve-b1') {
      if (!/<h1[\s>]/i.test(c.html)) push(false, 'No <h1> found', 'The name heading is step 1. Type: <h1>Your Name</h1>.');
      if (/<img(?![^>]*alt=)/i.test(c.html)) push(false, '<img> missing alt', 'Add alt="words" — screen readers need it, and the checker requires it.');
      if (/<a(?![^>]*href=)/i.test(c.html)) push(false, '<a> missing href', 'A link needs href="https://..." or it goes nowhere.');
      const opens = (c.html.match(/<(h1|a|p|div|table|thead|tbody|tr|th|td|form|button)\b/gi) || []).length;
      const closes = (c.html.match(/<\/(h1|a|p|div|table|thead|tbody|tr|th|td|form|button)>/gi) || []).length;
      if (opens > closes) push(false, 'Unclosed tag?', 'You opened ' + opens + ' tags but closed ' + closes + '. Every opener needs its </closer>.');
      if (!out.length) push(true, 'HTML looks structurally fine', 'Tags present with attributes. If Check still fails, compare spelling of tag names.');
    } else if (id === 'solve-h2' || id === 'solve-b3') {
      if (!/<form[\s>]/i.test(c.html)) push(false, 'Inputs outside <form>', 'Wrap everything in <form>…</form> so submit collects it.');
      if (!/preventDefault/i.test(c.js)) push(false, 'Page will reload on submit', 'First line of the handler: e.preventDefault(). Otherwise your check flashes and vanishes.');
      if (!/getElementById|querySelector/i.test(c.js)) push(false, 'Nothing selected', 'You cannot check what you never grabbed — select the input first.');
      if (!out.length) push(true, 'Form wiring looks right', 'If the LIVE check fails, log the value: is the id spelled exactly (#vname vs vName)?');
    } else if (id === 'solve-c1' || id === 'solve-b2' || id === 'solve-c2') {
      if (!/display\s*:\s*(flex|grid)/i.test(c.css)) push(false, 'No layout mode', 'Boxes stack by default. Add display:flex (navbar) or display:grid (cards).');
      if (!/^[^{]*\{[^}]*\}/m.test(c.css) && c.css.trim()) push(false, 'Rule shape wrong?', 'Every rule needs selector { property: value; } — check braces, colon, semicolon.');
      if (/{\s*}/.test(c.css.replace(/\s+/g, ''))) push(false, 'Empty rule {}', 'You wrote a selector with nothing inside. Fill the braces.');
      if (!out.length) push(true, 'CSS parses as rules', 'If Check fails, the SELECTOR is the suspect: .card styles class="card", not class="cards".');
    } else if (id === 'solve-j1' || id === 'solve-j2') {
      if (!/Number\(|parseInt|length|value/i.test(c.js)) push(false, 'Never reads data', 'Counter/todo must READ (input value / current number) before writing. Check .value or textContent appears.');
      if (!/textContent|innerHTML|append/i.test(c.js)) push(false, 'Never writes back', 'Reading is half the job — write the result with textContent or appendChild.');
      if (!out.length) push(true, 'Read+write both present', 'If LIVE fails: ids exact? Listener on "click" spelled exactly? Run first, then Check.');
    } else if (task.kind === 'py') {
      const lines = (c.py || '').split('\n');
      const badIndent = lines.some((l) => /^\t/.test(l));
      if (badIndent) push(false, 'Tabs detected', 'Python here wants spaces. Replace tab indents with 2–4 spaces.');
      if (!/print\s*\(/i.test(c.py)) push(false, 'No print(', 'Computing is not showing — print() IS the output the checker reads.');
      if (!out.length) push(true, 'Python shape looks fine', 'If output mismatches, print your variables to see actual values.');
    } else {
      push(true, 'Code present', 'Press Run, then Check — the verdict names exactly what is missing.');
    }
    return out;
  }
  function plan(task, results, code) {
    const steps = [];
    const miss = (results || []).filter((r) => !r.pass);
    const f = analyze(task, code);
    f.filter((x) => !x.ok).slice(0, 2).forEach((x, i) => steps.push({ t: 'Fix: ' + x.title, why: x.detail }));
    miss.slice(0, 3).forEach((m) => {
      if (!steps.some((s) => s.t.includes(m.desc))) steps.push({ t: 'Pass check: ' + m.desc, why: WHY[m.id] || 'Each ✅ is one proven skill. Do the smallest fix that flips it.' });
    });
    if (!steps.length) steps.push({ t: 'All green — lock it in', why: 'Correct code you cannot explain fades. Tell the bot "why" for any check to cement it.' });
    return steps;
  }
  function ask(q, ctx) {
    const s = (q || '').trim();
    const sl = s.toLowerCase();
    const task = (ctx && ctx.task) || null;
    const results = (ctx && ctx.results) || [];
    const code = (ctx && ctx.code) || {};
    let m = sl.match(/^(what is|what's|whats|define|meaning of|explain|definition of)\s+(.+?)(\?|$)/);
    if (m) {
      const k = conceptOf(m[2]);
      if (k) return card(k);
      return 'I do not have "<b>' + esc(m[2]) + '</b>" in my notebook yet. Try: tag, flexbox, listener, loop, indent, contrast — or ask "how do I …".';
    }
    if (/\bhint\b|\bstuck\b|\bhelp\b/.test(sl) || /^how (do i|to|can)/.test(sl)) {
      if (!task) return 'Pick a Solver task first (above the editor), then ask — I plan around YOUR task and YOUR code.';
      const steps = plan(task, results, code);
      return '<b>🪜 Plan for ' + esc(task.title) + ':</b><br>' + steps.map((x, i) =>
        '<b>' + (i + 1) + '. ' + esc(x.t) + '</b><br><span style="color:#475569;">↳ ' + esc(x.why) + '</span>').join('<br>');
    }
    if (sl.startsWith('why') || sl.includes(' why ') || sl.includes('why is') || sl.includes('why does')) {
      const miss = results.find((r) => !r.pass);
      const k = conceptOf(sl);
      if (k && !miss) return card(k);
      if (miss) return 'Because <b>' + esc(miss.desc) + '</b>: ' + esc(WHY[miss.id] || 'it proves one real skill — flip it and you own it.');
      if (k) return card(k);
      return 'Tell me which check or rule ("why flex?", "why alt?") and I will explain exactly why it is correct.';
    }
    if (/^(next|what next|what now|done)/.test(sl)) {
      const allPass = results.length && results.every((r) => r.pass);
      if (task && allPass) return 'Task green ✅ — next: press the <b>path stepper</b> above the editor for your next unlocked task, or tick it in Levels. Streaks beat marathons: one task a day.';
      if (task) return 'Finish <b>' + esc(task.title) + '</b> first: Run → Check → fix the ❌ → ask "hint" anytime.';
      return 'Start: Learn → lesson 1 → its Practice button. That is the whole on-ramp.';
    }
    if (/[<>]/.test(s) || /\bdef |\{|;\b/.test(s) || /print\s*\(/.test(s)) {
      if (!task) return 'Paste it in the editor + press Run first — then I can see what the browser sees.';
      const f = analyze(task, { html: s, css: s, js: s, py: s });
      return '<b>🔍 Reading your snippet:</b><br>' + f.map((x) =>
        (x.ok ? '✅ ' : '❌ ') + '<b>' + esc(x.title) + '</b> — ' + esc(x.detail)).join('<br>');
    }
    const k = conceptOf(sl);
    if (k) return card(k) + (task ? '<br>Applies to <b>' + esc(task.title) + '</b>: fix the ❌ checks, then Check again.' : '');
    return 'I analyze <b>your task + your code</b>, so give me something to chew on:<br>1. "hint" → step-by-step plan<br>2. "why …?" → reason a rule is correct<br>3. "what is …?" → definition + example<br>4. Paste your broken line → diagnosis' +
      (task ? '<br>Current task: <b>' + esc(task.title) + '</b>.' : '<br>Tip: pick a Solver task first so I see your code.');
  }
  function why(id) { return WHY[id] || 'it proves one real, checkable skill.'; }
  return { ask, why, analyze, plan, CONCEPTS };
})();
