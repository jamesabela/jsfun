import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const css = fs.readFileSync('pythoncopy.css', 'utf8');
const js = fs.readFileSync('pythoncopy.js', 'utf8');
const html = fs.readFileSync('pythoncopy.html', 'utf8');
const manifest = JSON.parse(fs.readFileSync('pythoncopy.webmanifest', 'utf8'));

function extractCssBlock(source, selectorRegex) {
  const match = source.match(selectorRegex);
  assert.ok(match, `Could not find CSS block matching ${selectorRegex}`);
  return match[1];
}

// 1. Shared CSS custom properties prevent desktop & mobile drift between layers
const shellBlock = extractCssBlock(css, /^\s*\.editor-shell\s*\{([^}]*)\}/m);
for (const prop of [
  '--editor-gutter-width',
  '--editor-pad-y',
  '--editor-pad-x',
  '--editor-font-family',
  '--editor-font-size',
  '--editor-line-height',
  '--editor-tab-size',
]) {
  assert.ok(shellBlock.includes(prop), `.editor-shell must define ${prop}`);
}
assert.match(shellBlock, /grid-template-columns:\s*var\(--editor-gutter-width\)\s+1fr/);

const displayBlock = extractCssBlock(css, /^\s*#displayEditor\s*\{([^}]*)\}/m);
const editorBlock = extractCssBlock(css, /^\s*#editor\s*\{([^}]*)\}/m);
const lineNumsBlock = extractCssBlock(css, /^\s*\.line-numbers\s*\{([^}]*)\}/m);

for (const [name, block] of [
  ['#displayEditor', displayBlock],
  ['#editor', editorBlock],
  ['.line-numbers', lineNumsBlock],
]) {
  assert.match(block, /font-family:\s*var\(--editor-font-family\)/, `${name} must use --editor-font-family`);
  assert.match(block, /font-size:\s*var\(--editor-font-size\)/, `${name} must use --editor-font-size`);
  assert.match(block, /line-height:\s*var\(--editor-line-height\)/, `${name} must use --editor-line-height`);
  assert.match(block, /white-space:\s*pre\b/, `${name} must use white-space: pre`);
}

for (const [name, block] of [
  ['#displayEditor', displayBlock],
  ['#editor', editorBlock],
]) {
  assert.match(block, /padding:\s*var\(--editor-pad-y\)\s+var\(--editor-pad-x\)/, `${name} must share --editor-pad-y/--editor-pad-x`);
  assert.match(block, /tab-size:\s*var\(--editor-tab-size\)/, `${name} must share --editor-tab-size`);
}

// #displayEditor sits at left: var(--editor-gutter-width); right: 0; so width: 100% would overflow by gutter width
assert.ok(!/width:\s*100%/.test(displayBlock), '#displayEditor must not set width: 100% alongside left offset');
assert.match(displayBlock, /left:\s*var\(--editor-gutter-width\)/, '#displayEditor must align left to --editor-gutter-width');

// 2. JS guardrail: never bypass renderHighlightedEditorCode() with raw editor.value
assert.ok(
  !/displayCode\.textContent\s*=\s*editor\.value\b/.test(js),
  'Do not assign editor.value directly to displayCode.textContent; use renderHighlightedEditorCode() so trailing newlines stay in sync.'
);

// 3. Behavioural unit tests for renderHighlightedEditorCode() and syncLineNumberScroll()
const fnStart = js.indexOf('function renderHighlightedEditorCode(');
const fnEnd = js.indexOf('\nfunction toggleRunner(');
assert.ok(fnStart !== -1 && fnEnd > fnStart, 'Could not locate editor sync functions in pythoncopy.js');

let highlightCalls = 0;
const mockEditor = { value: '', scrollTop: 0, scrollLeft: 0, offsetHeight: 400, clientHeight: 400 };
const mockDisplayEditor = { scrollTop: 0, scrollLeft: 0, style: {} };
const mockDisplayCode = { textContent: '', dataset: {} };
const mockLineNumbers = { textContent: '', scrollTop: 0, style: {} };
const mockHighlightLayer = { style: {} };

const context = vm.createContext({
  currentAppMode: 'edit',
  editor: mockEditor,
  displayEditor: mockDisplayEditor,
  displayCode: mockDisplayCode,
  lineNumbers: mockLineNumbers,
  highlightLayer: mockHighlightLayer,
  Prism: { highlightElement: () => { highlightCalls += 1; } },
});
vm.runInContext(js.slice(fnStart, fnEnd), context);

// 3a. Trailing newline gets phantom space so <pre><code> matches <textarea> height
mockEditor.value = 'print("hi")\n';
vm.runInContext('updateLineNumbers()', context);
assert.equal(mockDisplayCode.textContent, 'print("hi")\n ');
assert.equal(mockLineNumbers.textContent, '1\n2');
assert.equal(highlightCalls, 1);

// 3b. Calling again with unchanged code skips redundant Prism highlight
vm.runInContext('updateLineNumbers()', context);
assert.equal(highlightCalls, 1);

// 3c. Non-trailing newline renders verbatim
mockEditor.value = 'a = 1\nb = 2';
vm.runInContext('updateLineNumbers()', context);
assert.equal(mockDisplayCode.textContent, 'a = 1\nb = 2');
assert.equal(highlightCalls, 2);

// 3d. Programmatic syncLineNumberScroll() (no event) still syncs displayEditor & lineNumbers
mockEditor.scrollTop = 120;
mockEditor.scrollLeft = 40;
vm.runInContext('syncLineNumberScroll()', context);
assert.equal(mockDisplayEditor.scrollTop, 120);
assert.equal(mockDisplayEditor.scrollLeft, 40);
assert.equal(mockLineNumbers.scrollTop, 120);
assert.equal(mockHighlightLayer.style.top, '-106px');

// 3e. Horizontal scrollbar compensation (15px scrollbar -> 29px bottom padding on displayEditor & lineNumbers)
mockEditor.offsetHeight = 400;
mockEditor.clientHeight = 385;
vm.runInContext('syncLineNumberScroll()', context);
assert.equal(mockDisplayEditor.style.paddingBottom, '29px');
assert.equal(mockLineNumbers.style.paddingBottom, '29px');

// 3f. Display mode syncs from displayEditor instead of editor
context.currentAppMode = 'display';
mockDisplayEditor.scrollTop = 72;
mockDisplayEditor.scrollLeft = 10;
vm.runInContext('syncLineNumberScroll()', context);
assert.equal(mockEditor.scrollTop, 72);
assert.equal(mockLineNumbers.scrollTop, 72);

// 4. Version & cache-busting consistency checks
const jsVerMatch = js.match(/window\.pythonCopyVersion\s*=\s*(\d+)/);
assert.ok(jsVerMatch, 'window.pythonCopyVersion missing in pythoncopy.js');
const v = jsVerMatch[1];
assert.ok(html.includes(`pythoncopy.css?v=${v}`), `pythoncopy.html should reference pythoncopy.css?v=${v}`);
assert.ok(html.includes(`pythoncopy-errors.js?v=${v}`), `pythoncopy.html should reference pythoncopy-errors.js?v=${v}`);
assert.ok(html.includes(`pythoncopy.js?v=${v}`), `pythoncopy.html should reference pythoncopy.js?v=${v}`);
assert.ok(html.includes(`window.pythonCopyVersion !== ${v}`), `pythoncopy.html should check window.pythonCopyVersion !== ${v}`);
assert.ok(html.includes(`Python Code Lab ${manifest.version}`), `pythoncopy.html header should match webmanifest version ${manifest.version}`);

console.log('pythoncopy-editor-sync.mjs passed (CSS parity, JS guardrails, scroll/scrollbar sync, version checks).');
