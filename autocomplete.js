// VS Code-style autocomplete for the Solver Lab editors (HTML/CSS/JS/Python).
// Popup with docs, Tab/Enter accept, arrows navigate, Esc closes. No dependencies.
window.CDAutocomplete = (() => {
  const LANGS = {
    html: { trig: /[A-Za-z][A-Za-z0-9-]*$|<\/?[A-Za-z][A-Za-z0-9-]*$/, items: [
      ['h1', '<h1>…</h1> heading'], ['p', '<p>…</p> paragraph'], ['div', '<div>…</div> block'],
      ['span', '<span>…</span> inline'], ['a', '<a href="">…</a> link'], ['img', '<img src="" alt="">'],
      ['input', '<input type="text">'], ['button', '<button>…</button>'], ['form', '<form>…</form>'],
      ['ul', '<ul>…</ul> list'], ['li', '<li>…</li> item'], ['nav', '<nav>…</nav>'],
      ['section', '<section>…</section>'], ['iframe', '<iframe src="">'], ['textarea', '<textarea>'],
      ['select', '<select>…</select>'], ['label', '<label>…</label>'], ['required', 'required attr'],
      ['placeholder', 'placeholder=""'], ['href', 'href=""'], ['src', 'src=""'], ['alt', 'alt=""']] },
    css: { trig: /[A-Za-z-][A-Za-z-]*$|[#.][A-Za-z0-9_-]*$/, items: [
      ['display: flex;', 'flex layout'], ['display: grid;', 'grid layout'],
      ['justify-content: space-between;', 'main-axis align'], ['align-items: center;', 'cross-axis align'],
      ['gap: 1rem;', 'spacing'], ['margin: 0 auto;', 'center block'], ['padding: 1rem;', 'inner space'],
      ['background: #4f46e5;', 'background'], ['color: white;', 'text color'],
      ['border: 1px solid #e2e8f0;', 'border'], ['border-radius: 12px;', 'rounded'],
      ['width: 100%;', 'full width'], ['font-size: 1rem;', 'text size'], ['text-align: center;', 'center text'],
      ['@media (max-width: 600px) { }', 'mobile rules'], [':hover', 'hover state']] },
    js: { trig: /[A-Za-z_$][A-Za-z0-9_$.]*$/, items: [
      ['function', 'function name() {}'], ['const', 'const x = …'], ['let', 'let x = …'],
      ['addEventListener', 'el.addEventListener("click", …)'], ['getElementById', 'document.getElementById("id")'],
      ['querySelector', 'document.querySelector("…")'], ['createElement', 'document.createElement("li")'],
      ['appendChild', 'parent.appendChild(el)'], ['textContent', 'el.textContent'],
      ['localStorage', 'setItem / getItem'], ['JSON.stringify', 'object → string'], ['JSON.parse', 'string → object'],
      ['forEach', 'arr.forEach(…)'], ['fetch', 'fetch(url)…'], ['alert', 'alert(…)'], ['console.log', 'debug print']] },
    py: { trig: /[A-Za-z_][A-Za-z0-9_]*$/, items: [
      ['print()', 'print("hi")'], ['def', 'def name():'], ['for', 'for i in range(5):'],
      ['range()', 'range(5) → 0..4'], ['if', 'if x > 0:'], ['else:', 'else:'], ['input()', 'input("Name: ")'],
      ['len()', 'len(list)'], ['append()', 'list.append(x)'], ['return', 'return value'],
      ['while', 'while cond:'], ['import', 'import math'], ['f-string', 'f"Hi {name}"']] }
  };
  function attach(ta, lang) {
    const dict = LANGS[lang];
    if (!ta || !dict) return;
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:12px;right:12px;bottom:150px;z-index:20;display:none;' +
      'background:#fff;border:1.5px solid #4f46e5;border-radius:12px;box-shadow:0 18px 44px -12px rgba(79,70,229,.45);overflow:hidden;';
    ta.parentElement.style.position = 'relative';
    ta.parentElement.appendChild(box);
    let list = [], idx = 0, open = false;
    const cur = () => {
      const pos = ta.selectionStart, before = ta.value.slice(0, pos);
      const m = before.match(dict.trig);
      return m ? m[0].replace(/^<\/?/, '') : '';
    };
    function render() {
      box.innerHTML = list.slice(0, 7).map((s, i) =>
        `<div data-i="${i}" style="padding:.45rem .8rem;font-size:.82rem;font-family:Consolas,monospace;cursor:pointer;` +
        (i === idx ? 'background:#eef2ff;color:#4f46e5;font-weight:700;' : 'color:#334155;') + '">' +
        s[0].replace(/&|<|>/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) +
        `<span style="float:right;color:#94a3b8;font-size:.72rem;">${s[1]}</span></div>`).join('') +
        '<div style="padding:.3rem .8rem;font-size:.7rem;color:#94a3b8;border-top:1px solid #e2e8f0;">Tab ↵ accept · Esc close</div>';
      box.querySelectorAll('[data-i]').forEach((d) => {
        d.onmousedown = (e) => { e.preventDefault(); accept(Number(d.dataset.i)); };
      });
    }
    function hide() { open = false; box.style.display = 'none'; }
    function accept(i) {
      const s = list[i];
      if (!s) return hide();
      const pos = ta.selectionStart, before = ta.value.slice(0, pos);
      const m = before.match(dict.trig);
      const word = m ? m[0] : '';
      ta.value = before.slice(0, before.length - word.length) + s[0] + ta.value.slice(pos);
      ta.selectionStart = ta.selectionEnd = before.length - word.length + s[0].length;
      ta.focus(); hide();
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
    ta.addEventListener('input', () => {
      const w = cur();
      if (w.length < 1) return hide();
      list = dict.items.filter((s) => s[0].toLowerCase().startsWith(w.toLowerCase()));
      if (!list.length) return hide();
      idx = 0; open = true; box.style.display = 'block'; render();
    });
    ta.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % Math.min(7, list.length); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + Math.min(7, list.length)) % Math.min(7, list.length); render(); }
      else if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); accept(idx); }
      else if (e.key === 'Escape') hide();
    });
    ta.addEventListener('blur', () => setTimeout(hide, 150));
  }
  return { attach };
})();
