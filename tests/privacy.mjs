import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const source = fs.readFileSync('privacy.js', 'utf8');
assert.doesNotMatch(source, /goatcounter\.com|gc\.zgo\.at|jsfun\.analytics/i, 'privacy.js must not contain GoatCounter or analytics tracking');

function embedHarness(privateSrc = 'https://docs.google.com/presentation/d/demo/embed') {
  const requests = [];
  const prepended = [];
  const listeners = {};
  const frame = {
    dataset: { privateSrc },
    hidden: false,
    src: '',
    referrerPolicy: '',
    before(el) {
      this.card = el;
    },
  };
  function makeEl(tag) {
    return {
      tag,
      type: '',
      className: '',
      textContent: '',
      href: '',
      target: '',
      rel: '',
      style: { cssText: '' },
      children: [],
      listeners: {},
      removed: false,
      append(...nodes) {
        this.children.push(...nodes);
      },
      addEventListener(ev, fn) {
        this.listeners[ev] = fn;
      },
      remove() {
        this.removed = true;
      },
    };
  }
  const context = {
    URL,
    document: {
      querySelectorAll(sel) {
        return sel === 'iframe[data-private-src]' ? [frame] : [];
      },
      createElement: makeEl,
      body: {
        prepend(el) { prepended.push(el); },
        appendChild(el) { requests.push(el); },
      },
    },
    window: {
      addEventListener(k, fn) { listeners[k] = fn; },
    },
  };
  vm.runInNewContext(source, context);
  const button = frame.card.children.find(c => c.tag === 'button');
  const meta = frame.card.children.find(c => c.tag === 'p');
  const privacyLink = meta ? meta.children.find(c => c.tag === 'a') : null;
  return { frame, card: frame.card, button, privacyLink, requests, prepended };
}

const h = embedHarness('https://docs.google.com/presentation/d/demo/embed');
assert.equal(h.requests.length, 0, 'No analytics requests should be made');
assert.equal(h.prepended.length, 0, 'No opt-in analytics banner should be shown');
assert.equal(h.frame.hidden, true, 'External embed iframe should be hidden until clicked');
assert.equal(h.frame.src, '', 'External embed iframe should not load before click');
assert.match(h.button.textContent, /Google Slides/);
assert.equal(h.privacyLink.href, 'https://policies.google.com/privacy');

h.button.listeners.click();
assert.equal(h.frame.referrerPolicy, 'no-referrer');
assert.equal(h.frame.src, 'https://docs.google.com/presentation/d/demo/embed');
assert.equal(h.frame.hidden, false);
assert.equal(h.card.removed, true);

const yt = embedHarness('https://www.youtube-nocookie.com/embed/demo');
assert.match(yt.button.textContent, /YouTube Video/);
assert.equal(yt.privacyLink.href, 'https://policies.google.com/privacy');

const sp = embedHarness('https://open.spotify.com/embed/show/demo');
assert.match(sp.button.textContent, /Spotify Player/);
assert.equal(sp.privacyLink.href, 'https://www.spotify.com/legal/privacy-policy/');

const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '*.html'], { encoding: 'utf8' }).trim().split('\n'))]
  .filter(file => !/^google[a-f0-9]+\.html$/i.test(file));

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (file !== 'privacy.html') assert.match(html, /href="(?:\.\.\/)*privacy.html"/, file);
  assert.match(html, /<meta name="referrer" content="no-referrer">/, file);
  assert.doesNotMatch(html, /src=["'](?:https?:)?\/\/gc\.zgo\.at/, file);
  assert.doesNotMatch(html, /goatcounter\.com/, file);
  const m = html.match(/<script src="([^"]*privacy.js)"/);
  assert.ok(m, file);
  assert.ok(html.includes(`data-page="/${file}"`), `${file}: fixed page identifier must match its repository path`);
  assert.ok(fs.existsSync(new URL(m[1], new URL(file, `file://${process.cwd()}/`))), file);
  assert.doesNotMatch(html, /<iframe\b[^>]*\ssrc=["']https?:\/\//, file);
}

console.log(`PASS: ${files.length} page links, scripts, referrer policies and embed gates; zero analytics/GoatCounter and no opt-in banner.`);
