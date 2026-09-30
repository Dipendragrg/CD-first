// UI/UX DIY studio: theme knobs with live preview + CSS copy, contrast checker, rules.
// No backend. Renders into #designRoot so portfolio stays small.
window.CDDesign = (() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const RULES = [
    'Contrast 4.5+ for body text (checker above proves it).',
    'One accent color + neutrals. Two accents fight.',
    'Spacing in 8s: 8, 16, 24 — rhythm beats random gaps.',
    'Line length under ~70 chars, or eyes get lost.',
    'Buttons must look clickable: fill, radius, hover lift.'
  ];
  function lum(hex) {
    const c = hex.replace('#', '');
    const v = [0, 2, 4].map((i) => {
      const x = parseInt(c.substr(i, 2), 16) / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function ratio(a, b) {
    const x = lum(a), y = lum(b);
    return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05));
  }
  function paint() {
    const accent = $('dsAccent').value, r = $('dsRadius').value, font = $('dsFont').value;
    $('dsRadiusVal').textContent = r + 'px';
    const pv = $('dsPreview');
    pv.style.borderRadius = r + 'px';
    pv.style.fontFamily = font + ', sans-serif';
    $('dsPrevBtn').style.background = accent;
    $('dsPrevBtn').style.borderRadius = Math.max(4, r - 4) + 'px';
    $('dsPrevTitle').style.color = accent;
    $('dsCss').value = '/* your theme — paste into style.css */\n:root {\n  --accent: ' + accent + ';\n  --radius: ' + r + 'px;\n  --font: ' + font + ', sans-serif;\n}';
  }
  function check() {
    const fg = $('dsFg').value, bg = $('dsBg').value, r = ratio(fg, bg);
    const s = $('dsSample');
    s.style.color = fg; s.style.background = bg;
    const verdict = r >= 7 ? 'AAA — excellent' : r >= 4.5 ? 'AA — passes body text' : r >= 3 ? 'AA-large only — headings ok, body no' : 'FAIL — unreadable, pick again';
    $('dsVerdict').innerHTML = 'Ratio <b>' + r.toFixed(2) + ':1</b> — ' + verdict;
    $('dsVerdict').style.color = r >= 4.5 ? '#16a34a' : '#dc2626';
  }
  function init() {
    if (!$('designRoot')) return;
    $('designRoot').innerHTML =
      '<div class="card"><h4>🎨 Theme studio</h4>' +
      '<div style="display:grid;gap:.6rem;margin:.6rem 0;">' +
      '<label style="font-size:.85rem;">Accent <input type="color" id="dsAccent" value="#4f46e5" style="width:100%;height:44px;padding:.2rem;"></label>' +
      '<label style="font-size:.85rem;">Corners <span id="dsRadiusVal">16px</span><input type="range" id="dsRadius" min="0" max="32" value="16" style="width:100%;"></label>' +
      '<label style="font-size:.85rem;">Font <select id="dsFont"><option>Inter</option><option>Sora</option><option>Georgia</option><option>Consolas</option></select></label></div>' +
      '<div id="dsPreview" style="border:1px solid var(--border);padding:1.2rem;text-align:center;">' +
      '<b id="dsPrevTitle">Preview card</b><p style="font-size:.85rem;color:var(--muted);">Buttons follow your theme.</p>' +
      '<button id="dsPrevBtn" style="margin-top:.5rem;border:none;color:#fff;padding:.6rem 1.2rem;font-weight:700;cursor:pointer;">Sample</button></div>' +
      '<textarea id="dsCss" rows="5" readonly style="font-family:Consolas,monospace;font-size:.76rem;margin-top:.6rem;"></textarea>' +
      '<button id="dsCopy" style="margin-top:.5rem;background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:999px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;">Copy CSS</button></div>' +
      '<div class="card"><h4>◐ Contrast checker</h4>' +
      '<div style="display:flex;gap:.6rem;margin:.6rem 0;">' +
      '<label style="font-size:.85rem;flex:1;">Text<input type="color" id="dsFg" value="#0f172a" style="width:100%;height:44px;"></label>' +
      '<label style="font-size:.85rem;flex:1;">Back<input type="color" id="dsBg" value="#ffffff" style="width:100%;height:44px;"></label></div>' +
      '<div id="dsSample" style="border-radius:10px;padding:1rem;text-align:center;font-weight:700;">Can you read me?</div>' +
      '<p id="dsVerdict" style="font-weight:700;margin-top:.5rem;"></p>' +
      '<h4 style="margin-top:1rem;">📏 5 designer rules</h4><div style="font-size:.88rem;color:var(--muted);">' +
      RULES.map((r, i) => '<p style="margin:.3rem 0;"><b>' + (i + 1) + '.</b> ' + esc(r) + '</p>').join('') + '</div></div>';
    ['dsAccent', 'dsRadius', 'dsFont'].forEach((id) => $(id).addEventListener('input', paint));
    ['dsFg', 'dsBg'].forEach((id) => $(id).addEventListener('input', check));
    $('dsCopy').onclick = () => {
      $('dsCss').select();
      try { document.execCommand('copy'); } catch {}
      try { navigator.clipboard.writeText($('dsCss').value); } catch {}
      $('dsCopy').textContent = 'Copied!';
      setTimeout(() => { $('dsCopy').textContent = 'Copy CSS'; }, 1200);
    };
    paint(); check();
  }
  return { init };
})();
