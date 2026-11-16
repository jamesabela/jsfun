/* JSFun privacy controls. No external analytics code is loaded. */
(() => {
  'use strict';
  const ANALYTICS_ENABLED = true; // Central kill switch; opt-in is still required.
  const KEY = 'jsfun.analytics.v1';
  const script = document.currentScript;
  const page = script && script.dataset.page;
  let sent = false;
  let savedChoice = false;
  let preference = readPreference();
  function readPreference() {
    try {
      const value = localStorage.getItem(KEY);
      savedChoice = value === 'allow' || value === 'deny';
      return value === 'allow' ? 'allow' : 'deny';
    } catch (_) {
      savedChoice = false;
      return 'deny';
    }
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
      (!saved ? ' Your browser could not save this choice; it applies to this page only.' : savedChoice ? ' This choice is saved in this browser.' : ' No choice saved yet; analytics stays off unless you allow it.') +
      (location.hostname !== 'jamesabela.github.io' ? ' Preview mode: no analytics is sent from this address, even if you allow it. Choices here do not change your preference on the live site.' : '');
    document.querySelectorAll('[data-analytics-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.analyticsChoice === preference));
    });
  }
  function choose(choice) {
    preference = choice === 'allow' ? 'allow' : 'deny';
    let saved = true;
    try { localStorage.setItem(KEY, preference); } catch (_) { saved = false; }
    savedChoice = saved;
    const banner = document.getElementById('jsfun-analytics-banner');
    if (banner && typeof banner.remove === 'function') banner.remove();
    status(saved);
    count();
  }
  function showBanner() {
    if (!ANALYTICS_ENABLED || savedChoice || restricted() || page === '/privacy.html' ||
        !document.body || typeof document.body.prepend !== 'function' ||
        document.getElementById('jsfun-analytics-banner')) return;
    const srcAttr = script && typeof script.getAttribute === 'function' ? script.getAttribute('src') : '';
    const noticeHref = srcAttr ? srcAttr.replace(/privacy\.js(?:\?.*)?$/, 'privacy.html#analytics') : 'privacy.html#analytics';
    const banner = document.createElement('div');
    banner.id = 'jsfun-analytics-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics preference');

    const style = document.createElement('style');
    style.textContent =
      '#jsfun-analytics-banner{box-sizing:border-box;width:100%;padding:10px 16px;background:#f8fafc;color:#1e293b;border-bottom:1px solid #cbd5e1;font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;flex-shrink:0;z-index:1000;}' +
      '#jsfun-analytics-banner p{margin:0;}' +
      '#jsfun-analytics-banner .jsfun-banner-actions{display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px;}' +
      '#jsfun-analytics-banner button{appearance:none;font:inherit;font-size:13px;font-weight:600;line-height:1.2;padding:7px 14px;min-height:34px;border-radius:6px;border:1px solid #64748b;background:#ffffff;color:#0f172a;cursor:pointer;}' +
      '#jsfun-analytics-banner button:hover{background:#e2e8f0;}' +
      '#jsfun-analytics-banner button:focus-visible,#jsfun-analytics-banner a:focus-visible{outline:3px solid #9a5100;outline-offset:2px;}' +
      '#jsfun-analytics-banner a{color:inherit;font-size:13px;text-decoration:underline;text-underline-offset:2px;}' +
      '@media (prefers-color-scheme:dark){#jsfun-analytics-banner{background:#1e293b;color:#f1f5f9;border-bottom-color:#475569;}#jsfun-analytics-banner button{background:#0f172a;color:#f8fafc;border-color:#94a3b8;}#jsfun-analytics-banner button:hover{background:#334155;}}';

    const text = document.createElement('p');
    text.textContent = 'Help improve JSFun? Can we count your visit to this page? No cookies, student work, or personal details are saved.';

    const actions = document.createElement('div');
    actions.className = 'jsfun-banner-actions';

    const allowBtn = document.createElement('button');
    allowBtn.type = 'button';
    allowBtn.dataset.analyticsChoice = 'allow';
    allowBtn.textContent = 'Yes, count my visit';
    allowBtn.addEventListener('click', () => choose('allow'));

    const denyBtn = document.createElement('button');
    denyBtn.type = 'button';
    denyBtn.dataset.analyticsChoice = 'deny';
    denyBtn.textContent = 'No thanks';
    denyBtn.addEventListener('click', () => choose('deny'));

    const link = document.createElement('a');
    link.href = noticeHref;
    link.textContent = 'Privacy & analytics settings';

    actions.append(allowBtn, denyBtn, link);
    banner.append(style, text, actions);
    document.body.prepend(banner);
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => choose(button.dataset.analyticsChoice));
  });
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      preference = readPreference();
      if (savedChoice) {
        const banner = document.getElementById('jsfun-analytics-banner');
        if (banner && typeof banner.remove === 'function') banner.remove();
      } else {
        showBanner();
      }
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
  showBanner();
  status();
  count();
})();
