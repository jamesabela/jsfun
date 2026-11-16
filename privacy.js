/* JSFun privacy controls. No external analytics code is loaded. */
(() => {
  'use strict';
  const ANALYTICS_ENABLED = true; // Central kill switch; opt-in is still required.
  const KEY = 'jsfun.analytics.v1';
  const script = document.currentScript;
  const page = script && script.dataset.page;
  let sent = false;
  let preference = readPreference();
  function readPreference() {
    try { return localStorage.getItem(KEY) === 'allow' ? 'allow' : 'deny'; }
    catch (_) { return 'deny'; }
  }
  function restricted() {
    return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  }
  function count() {
    if (!ANALYTICS_ENABLED || preference !== 'allow' || restricted() || sent ||
        location.hostname !== 'jamesabela.github.io' || window.top !== window.self ||
        !page || !/^\/[a-zA-Z0-9_./-]+\.html$/.test(page)) return;
    // The fixed identifier comes from the source HTML, never the address bar or title.
    // GoatCounter's documented pixel API; no query, referrer, screen or work data.
    const pixel = document.createElement('img');
    pixel.alt = '';
    pixel.hidden = true;
    pixel.referrerPolicy = 'no-referrer';
    pixel.onload = pixel.onerror = () => pixel.remove();
    pixel.src = 'https://jabela.goatcounter.com/count?p=' + encodeURIComponent(page) + '&ns=true';
    document.body.appendChild(pixel);
    sent = true;
  }
  function status(saved = true) {
    const output = document.getElementById('analytics-status');
    if (output) output.textContent = (preference === 'allow' ? 'Your choice: allow basic analytics.' : 'Your choice: analytics off.') +
      (!ANALYTICS_ENABLED ? ' Analytics is disabled for the whole site.' : restricted() ? ' Your browser privacy signal also blocks analytics.' : '') +
      (!saved ? ' Your browser could not save this choice; it applies to this page only.' : ' This choice is saved in this browser when storage is available.');
    document.querySelectorAll('[data-analytics-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.analyticsChoice === preference));
    });
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => {
      preference = button.dataset.analyticsChoice === 'allow' ? 'allow' : 'deny';
      let saved = true;
      try { localStorage.setItem(KEY, preference); } catch (_) { saved = false; }
      status(saved);
      count();
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      preference = readPreference();
      status();
      // Another tab's opt-in does not trigger a new request on this page.
    }
  });
  // Static external embeds require an explicit click before contacting the provider.
  document.querySelectorAll('iframe[data-private-src]').forEach(frame => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Load external content (' + new URL(frame.dataset.privateSrc).hostname + ')';
    button.style.cssText = 'position:relative;z-index:1;padding:12px;max-width:100%;white-space:normal;cursor:pointer;';
    frame.before(button);
    frame.hidden = true;
    button.addEventListener('click', () => {
      frame.referrerPolicy = 'no-referrer';
      frame.src = frame.dataset.privateSrc;
      frame.hidden = false;
      button.remove();
    });
  });
  status();
  count();
})();
