// Typing Lab: paragraph typing test with WPM + accuracy + best scores.
// No backend — best scores in localStorage. Works on file:// and localhost.
window.CDTyping = (() => {
  const PARAS = {
    easy: ['The sun rises early in the morning and the birds sing sweet songs in the tall green trees near my house every single day.',
      'I drink warm milk before school and I pack my bag with books, pencils and a small box of food my mother makes for me.',
      'My best friend lives next door and we walk to school together while talking about cricket, games and our favourite teachers.'],
    medium: ['Learning to code is like learning to cook: at first you follow every step slowly, but soon your hands remember the pattern and you start creating your own recipes.',
      'Dipen opens his laptop every morning, writes one small program, and saves it with a proud smile, because small steps repeated daily build real skill over time.',
      'If you want a responsive website, first write clean HTML for structure, then add CSS for beauty, and finally JavaScript to make every button come alive.'],
    hard: ['The experienced programmer refactored the tangled legacy codebase, extracting reusable functions until the once-fragile system finally passed every single test with confidence.',
      'Success rarely arrives overnight; it compounds quietly through disciplined practice, honest feedback, and the courage to rewrite what is broken instead of hiding it.',
      'The curious student opened the old broken radio to study every wire inside, learning more from one dead circuit than from ten perfect diagrams in a book.'],
    code: ['<section id="about"> <h2>About me</h2> <p>I am learning <a href="https://developer.mozilla.org">MDN docs</a> daily.</p> </section>',
      '.card { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }',
      'form.addEventListener("submit", (e) => { e.preventDefault(); const name = document.getElementById("name").value.trim(); });',
      'def greet(name): message = f"Namaste, {name}!" print(message) return message # greet("Dipen")']
  };
  const LS = 'cd-typing-best';
  const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
  const $ = (id) => document.getElementById(id);
  let para = '', startT = 0, timer = null, active = false;
  const lastPick = {};

  function renderPara() {
    $('typePara').innerHTML = [...para].map((ch, i) =>
      `<span data-i="${i}">${ch === ' ' ? '&nbsp;' : ch.replace(/&|<|>/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span>`).join('');
  }
  function paint() {
    const val = $('typeInput').value;
    const spans = $('typePara').querySelectorAll('span');
    let correct = 0;
    spans.forEach((s, i) => {
      s.style.cssText = 'border-radius:4px;padding:0 1px;';
      if (i < val.length) {
        const ok = val[i] === para[i];
        if (ok) correct++;
        s.style.background = ok ? '#bbf7d0' : '#fecaca';
      } else if (i === val.length) s.style.background = '#c7d2fe';
    });
    const mins = (Date.now() - startT) / 60000;
    const wpm = mins > 0.005 ? Math.round((correct / 5) / mins) : 0;
    const acc = val.length ? Math.round((correct / val.length) * 100) : 100;
    $('typeWpm').textContent = wpm;
    $('typeAcc').textContent = acc + '%';
    if (val.length >= para.length) finish(wpm, acc);
  }
  function tick() { $('typeTime').textContent = Math.floor((Date.now() - startT) / 1000) + 's'; }
  function finish(wpm, acc) {
    active = false; clearInterval(timer);
    $('typeInput').disabled = true;
    const diff = $('typeDiff').value, best = load();
    const prev = best[diff] || { wpm: 0 };
    let msg = `Done! ${wpm} WPM · ${acc}% accuracy.`;
    if (wpm > prev.wpm && acc >= 80) {
      best[diff] = { wpm, acc }; localStorage.setItem(LS, JSON.stringify(best));
      msg += ' 🏆 New best!';
    } else msg += ` Best (${diff}): ${prev.wpm} WPM.`;
    if (acc < 80) msg += ' Slow down for 80%+ accuracy to save best.';
    $('typeResult').textContent = msg;
    showBest();
  }
  function showBest() {
    const b = load(), d = $('typeDiff').value, cur = b[d];
    $('typeBest').textContent = 'Best: ' + (cur ? cur.wpm + ' WPM' : '—');
  }
  function start() {
    const diff = $('typeDiff').value;
    const list = PARAS[diff];
    let i = Math.floor(Math.random() * list.length);
    let guard = 0;
    while (list.length > 1 && i === lastPick[diff] && guard++ < 10) i = Math.floor(Math.random() * list.length);
    lastPick[diff] = i;
    para = list[i];
    renderPara();
    $('typeInput').value = ''; $('typeInput').disabled = false; $('typeInput').focus();
    $('typeWpm').textContent = '0'; $('typeAcc').textContent = '100%';
    $('typeTime').textContent = '0s'; $('typeResult').textContent = '';
    startT = Date.now(); active = true;
    clearInterval(timer); timer = setInterval(tick, 500);
    showBest();
  }
  function init() {
    $('typeStart').onclick = start;
    $('typeRetry').onclick = start;
    $('typeDiff').onchange = () => { showBest(); start(); };
    $('typeInput').addEventListener('input', () => { if (active) paint(); });
    showBest();
    para = PARAS.easy[0]; renderPara();
  }
  return { init };
})();
