// Typing Lab: paragraph typing test with WPM + accuracy + best scores.
// No backend — best scores in localStorage. Works on file:// and localhost.
window.CDTyping = (() => {
  const PARAS = {
    easy: ['The quick brown fox jumps over the lazy dog and runs to the river.',
      'I love to code every day because practice makes every coder better and faster.'],
    medium: ['Learning HTML, CSS and JavaScript opens the door to building fast, modern websites for everyone.',
      'Consistency beats talent: type daily, build small projects, and review your mistakes carefully.'],
    hard: ['const score = items.filter(x => x.done).reduce((a, b) => a + b.xp, 0); // total XP',
      'Debugging is twice as hard as writing code; clever code is hard to debug.'],
    code: ['<h1>Hello</h1> <a href="https://site.com">Visit</a> <img src="pic.png" alt="pic">',
      'nav { display: flex; gap: 1rem; justify-content: space-between; }',
      'btn.addEventListener("click", () => { count.textContent = Number(count.textContent) + 1; });',
      'for i in range(1, 6): total = total + i # add numbers 1 to 5']
  };
  const LS = 'cd-typing-best';
  const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
  const $ = (id) => document.getElementById(id);
  let para = '', startT = 0, timer = null, active = false, idx = 0;

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
    const list = PARAS[$('typeDiff').value];
    para = list[Math.floor(Math.random() * list.length)];
    idx = (idx + 1) % 997;
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
