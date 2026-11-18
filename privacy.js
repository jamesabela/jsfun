/* JSFun privacy controls. No analytics or tracking scripts are loaded. */
(() => {
  'use strict';
  const frames = document.querySelectorAll('iframe[data-private-src]');
  if (!frames.length) return;

  if (typeof document.head === 'object' && document.head && !document.getElementById('jsfun-private-embed-style')) {
    const style = document.createElement('style');
    style.id = 'jsfun-private-embed-style';
    style.textContent =
      '.jsfun-private-embed{box-sizing:border-box;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;border-radius:8px;background:linear-gradient(135deg,#f8fafc,#eef2ff);color:#0f172a;font:500 13px/1.4 system-ui,-apple-system,sans-serif;text-align:center;}' +
      '.jsfun-private-embed-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:#e2e8f0;color:#334155;font-size:12px;font-weight:600;}' +
      '.jsfun-private-embed-btn{appearance:none;padding:9px 18px;border:none;border-radius:8px;background:#2563eb;color:#ffffff;font:600 14px/1.3 system-ui,-apple-system,sans-serif;cursor:pointer;box-shadow:0 1px 2px rgba(15,23,42,0.15);}' +
      '.jsfun-private-embed-btn:hover{background:#1d4ed8;}' +
      '.jsfun-private-embed-btn:focus-visible,.jsfun-private-embed a:focus-visible{outline:3px solid #2563eb;outline-offset:2px;}' +
      '.jsfun-private-embed-meta{margin:0;font-size:12px;color:#475569;}' +
      '.jsfun-private-embed a{color:#1d4ed8;text-decoration:underline;text-underline-offset:2px;}' +
      '@media (prefers-color-scheme:dark){' +
      '.jsfun-private-embed{background:linear-gradient(135deg,#0f172a,#1e293b);color:#f8fafc;}' +
      '.jsfun-private-embed-badge{background:#334155;color:#e2e8f0;}' +
      '.jsfun-private-embed-btn{background:#3b82f6;color:#ffffff;}' +
      '.jsfun-private-embed-btn:hover{background:#2563eb;}' +
      '.jsfun-private-embed-meta{color:#cbd5e1;}' +
      '.jsfun-private-embed a{color:#93c5fd;}}';
    document.head.appendChild(style);
  }

  function getProviderInfo(urlString) {
    const host = new URL(urlString).hostname.toLowerCase();
    if (host === 'docs.google.com') {
      return {
        label: 'Google Slides',
        buttonText: 'Load Google Slides',
        host,
        privacyUrl: 'https://policies.google.com/privacy',
        privacyLabel: 'Google Privacy Policy',
      };
    }
    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      return {
        label: 'YouTube Video',
        buttonText: 'Load YouTube Video',
        host,
        privacyUrl: 'https://policies.google.com/privacy',
        privacyLabel: 'Google Privacy Policy',
      };
    }
    if (host.includes('spotify.com')) {
      return {
        label: 'Spotify Audio',
        buttonText: 'Load Spotify Player',
        host,
        privacyUrl: 'https://www.spotify.com/legal/privacy-policy/',
        privacyLabel: 'Spotify Privacy Policy',
      };
    }
    return {
      label: 'External Content',
      buttonText: 'Load external content (' + host + ')',
      host,
      privacyUrl: null,
      privacyLabel: null,
    };
  }

  // Static external embeds require an explicit click before contacting the provider.
  frames.forEach(frame => {
    const info = getProviderInfo(frame.dataset.privateSrc);
    const card = document.createElement('div');
    card.className = 'jsfun-private-embed';

    const parent = frame.parentElement;
    const parentStyle = parent && typeof getComputedStyle === 'function' ? getComputedStyle(parent) : null;
    const fillsParent = Boolean(
      parentStyle &&
      parentStyle.position === 'relative' &&
      (parseFloat(parentStyle.height) === 0 ||
        parseFloat(parentStyle.paddingBottom) > 0 ||
        (parentStyle.aspectRatio && parentStyle.aspectRatio !== 'auto'))
    );
    card.style.cssText = fillsParent
      ? 'position:absolute;inset:0;width:100%;height:100%;'
      : 'position:relative;width:100%;min-height:140px;';

    const badge = document.createElement('span');
    badge.className = 'jsfun-private-embed-badge';
    badge.textContent = info.label;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jsfun-private-embed-btn';
    button.textContent = info.buttonText;

    const meta = document.createElement('p');
    meta.className = 'jsfun-private-embed-meta';
    meta.append('Loads from ' + info.host);
    if (info.privacyUrl) {
      meta.append(' · ');
      const link = document.createElement('a');
      link.href = info.privacyUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = info.privacyLabel;
      meta.append(link);
    }

    card.append(badge, button, meta);
    frame.before(card);
    frame.hidden = true;
    button.addEventListener('click', () => {
      frame.referrerPolicy = 'no-referrer';
      frame.src = frame.dataset.privateSrc;
      frame.hidden = false;
      card.remove();
    });
  });
})();
