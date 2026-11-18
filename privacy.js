/* JSFun privacy controls. No analytics or tracking scripts are loaded. */
(() => {
  'use strict';
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
})();
