import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const errors = require('../pythoncopy-errors.js');

// 1. URL parameter mode tests (friendly by default)
assert.equal(errors.getErrorDisplayMode(''), 'friendly');
assert.equal(errors.getErrorDisplayMode('?blank'), 'friendly');
assert.equal(errors.getErrorDisplayMode('?errors=friendly'), 'friendly');
assert.equal(errors.getErrorDisplayMode('?friendlyErrors=1'), 'friendly');
assert.equal(errors.getErrorDisplayMode('?errors=raw'), 'standard');
assert.equal(errors.getErrorDisplayMode('?errors=standard'), 'standard');
assert.equal(errors.getErrorDisplayMode('?errors=python'), 'standard');
assert.equal(errors.getErrorDisplayMode('?friendlyErrors=0'), 'standard');
assert.equal(errors.getErrorDisplayMode('?friendlyErrors=false'), 'standard');
assert.equal(errors.getErrorDisplayMode('?friendly=0'), 'standard');

// 2. HTML escaping in inline code formatting
assert.equal(
  errors.formatInlineCode('Use `x < 5` and not `<script>alert(1)</script>`'),
  'Use <code>x &lt; 5</code> and not <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>'
);

// 3. Fallback Pyodide traceback parsing (must ignore _pyodide/_base.py line 573)
const pyodideTrace = [
  'PythonError: Traceback (most recent call last):',
  '  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async',
  '    await CodeRunner(',
  '  File "<exec>", line 86, in <module>',
  '  File "<user_code>", line 4, in <module>',
  "NameError: name 'scroe' is not defined",
].join('\n');

assert.equal(errors.extractUserLineNumber(pyodideTrace), 4);
const fallback = errors.analyzeFallbackError(pyodideTrace, 'score = 10\n\n\nprint(scroe)');
assert.equal(fallback.line, 4);
assert.equal(fallback.codeLine, 'print(scroe)');
assert.ok(!fallback.cleanTraceback.includes('_pyodide/_base.py'));
assert.ok(fallback.title.includes('scroe'));

// 4. Python-side analyzer tests using real python3
function runPythonCases(cases) {
  const harness = `
import builtins, json, sys

${errors.PYTHON_ERROR_ANALYZER_CODE}

cases = json.loads(sys.stdin.read())
results = []
for c in cases:
    src = c['code']
    ns = {'__name__': '__main__'}
    try:
        exec(compile(src, '<user_code>', 'exec'), ns)
        results.append({'unexpected_ok': True})
    except BaseException as exc:
        results.append(builtins._jsfun_analyze_error(exc, src, ns))
print(json.dumps(results))
`;
  const stdout = execFileSync('python3', ['-c', harness], {
    input: JSON.stringify(cases),
    encoding: 'utf8',
  });
  return JSON.parse(stdout);
}

const cases = [
  { name: 'missing colon', code: 'x = 5\nif x == 5\n    print("hi")', expectedLine: 2, titleMatch: /Missing colon/i },
  { name: 'missing colon with comment', code: 'for i in range(3) # loop\n    print(i)', expectedLine: 1, titleMatch: /Missing colon/i },
  { name: 'single equals in if', code: 'x = 5\nif x = 5:\n    print("hi")', expectedLine: 2, titleMatch: /==/ },
  { name: 'curly quotes', code: 'print(“hello”)', expectedLine: 1, titleMatch: /Curly quotes/i },
  { name: 'unclosed string', code: 'name = "Ada\nprint(name)', expectedLine: 1, titleMatch: /Unclosed quote/i },
  { name: 'unclosed paren on previous line', code: 'x = (1 + 2\nprint(x)', expectedLine: 1, titleMatch: /Unclosed bracket/i },
  { name: 'extra closing paren', code: 'print("hi"))', expectedLine: 1, titleMatch: /Extra closing bracket/i },
  { name: 'python 2 print', code: 'print "hello"', expectedLine: 1, titleMatch: /brackets around `print`/i },
  { name: 'else if', code: 'x = 1\nif x == 0:\n    pass\nelse if x == 1:\n    pass', expectedLine: 4, titleMatch: /elif/i },
  { name: 'capitalised If', code: 'If True:\n    print(1)', expectedLine: 1, titleMatch: /Capital letter in `If`/i },
  { name: 'space in variable name', code: 'my score = 10', expectedLine: 1, titleMatch: /cannot have spaces/i },
  { name: 'variable starts with digit', code: '1st_place = "Ada"', expectedLine: 1, titleMatch: /start with a number/i },
  { name: 'backwards assignment', code: '5 = x', expectedLine: 1, titleMatch: /left of `=`/i },
  { name: 'keyword as variable', code: 'class = "7A"', expectedLine: 1, titleMatch: /reserved Python word/i },
  { name: 'missing indent', code: 'if True:\nprint("hi")', expectedLine: 2, titleMatch: /Missing indent/i },
  { name: 'unexpected indent', code: 'x = 1\n    y = 2', expectedLine: 2, titleMatch: /Extra spaces/i },
  { name: 'NameError typo suggestion', code: 'score = 10\nprint(scroe)', expectedLine: 2, titleMatch: /scroe/, explainMatch: /`score`/ },
  { name: 'NameError capital Print', code: 'Print("hi")', expectedLine: 1, titleMatch: /Capital letter in `Print`/i, hintMatch: /`print`/ },
  { name: 'NameError lowercase true', code: 'x = true', expectedLine: 1, titleMatch: /Capital letter needed for `True`/i },
  { name: 'TypeError str + int', code: 'age = 12\nprint("Age: " + age)', expectedLine: 2, titleMatch: /mix text and numbers/i },
  { name: 'TypeError str > int', code: 'age = "12"\nif age > 10:\n    pass', expectedLine: 2, titleMatch: /compare text with a number/i },
  { name: 'TypeError for i in 10', code: 'for i in 10:\n    print(i)', expectedLine: 1, titleMatch: /loop over a single number/i, hintMatch: /range/ },
  { name: 'ValueError int(abc)', code: 'x = int("abc")', expectedLine: 1, titleMatch: /not a number/i },
  { name: 'ZeroDivisionError', code: 'x = 10 / 0', expectedLine: 1, titleMatch: /divide by zero/i },
  { name: 'IndexError', code: 'nums = [1, 2]\nprint(nums[5])', expectedLine: 2, titleMatch: /out of range/i },
  { name: 'KeyError', code: 'd = {"a": 1}\nprint(d["b"])', expectedLine: 2, titleMatch: /not found/i },
  { name: 'AttributeError', code: 'x = [1, 2]\nx.push(3)', expectedLine: 2, titleMatch: /Unknown command `.push`/i },
  { name: 'ModuleNotFoundError', code: 'import nonexistent_pkg_xyz', expectedLine: 1, titleMatch: /not available/i },
];

const results = runPythonCases(cases);
for (let i = 0; i < cases.length; i++) {
  const c = cases[i];
  const r = results[i];
  assert.ok(!r.unexpected_ok, `${c.name}: expected an error`);
  assert.equal(r.line, c.expectedLine, `${c.name}: expected line ${c.expectedLine}, got ${r.line} (${r.title})`);
  assert.match(r.title, c.titleMatch, `${c.name}: title "${r.title}" did not match ${c.titleMatch}`);
  if (c.explainMatch) {
    assert.match(r.explanation, c.explainMatch, `${c.name}: explanation "${r.explanation}" did not match ${c.explainMatch}`);
  }
  if (c.hintMatch) {
    assert.match(r.hint, c.hintMatch, `${c.name}: hint "${r.hint}" did not match ${c.hintMatch}`);
  }
  assert.ok(r.cleanTraceback && !r.cleanTraceback.includes('<string>'), `${c.name}: cleanTraceback should be clean`);
}

console.log(`pythoncopy-errors.mjs passed (${cases.length} Python error cases + URL/fallback/escaping checks).`);
