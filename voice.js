// Voice helpers: mic input (SpeechRecognition) + spoken replies (speechSynthesis).
// Optional enhancement — everything works without it. No keys, no network beyond browser APIs.
window.CDVoice = (() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let autoSpeak = false;
  const strip = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html;
    return (d.textContent || '').slice(0, 280);
  };
  function speak(text) {
    if (!('speechSynthesis' in window)) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(strip(text));
      u.lang = 'en-US'; u.rate = 1;
      speechSynthesis.speak(u);
      return true;
    } catch { return false; }
  }
  function listen(ontext, onerr) {
    if (!SR) { onerr && onerr('unsupported'); return; }
    try {
      const r = new SR();
      r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = (e) => ontext(e.results[0][0].transcript);
      r.onerror = (e) => onerr && onerr(e.error || 'mic error');
      r.start();
    } catch (e) { onerr && onerr('blocked'); }
  }
  return {
    speak, listen,
    supported: !!SR,
    tts: ('speechSynthesis' in window),
    get autoSpeak() { return autoSpeak; },
    set autoSpeak(v) { autoSpeak = !!v; if (!v && 'speechSynthesis' in window) speechSynthesis.cancel(); }
  };
})();
