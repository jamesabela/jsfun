/* JSFun privacy controls. No analytics or tracking scripts are loaded. */
(() => {
  'use strict';
  const frames = document.querySelectorAll('iframe[data-private-src]');
  if (!frames.length) return;

  if (typeof document.head === 'object' && document.head && !document.getElementById('jsfun-private-embed-style')) {
    const style = document.createElement('style');
    style.id = 'jsfun-private-embed-style';
    style.textContent =
      '.jsfun-private-embed-btn{box-sizing:border-box;z-index:1;display:flex;align-items:center;justify-content:center;padding:16px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;color:#0f172a;font:600 14px/1.45 system-ui,-apple-system,sans-serif;text-align:center;white-space:normal;cursor:pointer;}' +
      '.jsfun-private-embed-btn:hover{background:#e2e8f0;}' +
      '.jsfun-private-embed-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px;}' +
      '@media (prefers-color-scheme:dark){.jsfun-private-embed-btn{background:#1e293b;color:#f8fafc;border-color:#475569;}.jsfun-private-embed-btn:hover{background:#334155;}}';
    document.head.appendChild(style);
  }

  // Static external embeds require an explicit click before contacting the provider.
  frames.forEach(frame => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jsfun-private-embed-btn';
    button.textContent = 'Load external content (' + new URL(frame.dataset.privateSrc).hostname + ')';
    const parent = frame.parentElement;
    const parentStyle = parent && typeof getComputedStyle === 'function' ? getComputedStyle(parent) : null;
    const fillsParent = Boolean(
      parentStyle &&
      parentStyle.position === 'relative' &&
      (parseFloat(parentStyle.height) === 0 || (parentStyle.aspectRatio && parentStyle.aspectRatio !== 'auto'))
    );
    button.style.cssText = fillsParent
      ? 'position:absolute;inset:0;width:100%;height:100%;'
      : 'position:relative;width:100%;min-height:88px;';
    frame.before(button);
    frame.hidden = true;
    button.addEventListener('click', () => {
      frame.referrerPolicy = 'no-referrer';
      frame.src = frame.dataset.privateSrc;
      frame.hidden = false;
      button.remove();
    });
  });
})();
