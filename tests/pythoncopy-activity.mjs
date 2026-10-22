import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

let clock = 0;
const context = vm.createContext({ URLSearchParams, window: { location: { search: '?remindDownload=1' } }, performance: { now: () => clock }, document: { hidden: false }, Blob,
  setTimeout: () => {}, URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} } });
vm.runInContext(fs.readFileSync('pythoncopy-activity.js', 'utf8'), context);
const app = fs.readFileSync('pythoncopy.js', 'utf8');
vm.runInContext(app.slice(app.indexOf('    const activityLog ='), app.indexOf('    // --- Turtle Graphics')), context);
vm.runInContext('const editor = { value: "" };', context);
vm.runInContext(app.slice(app.indexOf('    function recordPlaybackSnapshot('), app.indexOf('    function scheduleRecordHistoryDebounced(')), context);
const run = code => vm.runInContext(code, context);
const last = () => run('activityLog.events.at(-1)');
run('editor.value = "# starter"; recordPlaybackSnapshot("Initial Load", true)');
assert.equal(last().file_id, 1);
assert.equal(last().characters_added, 0);
assert.equal(last().since_last_editor_key_ms, '');
clock = 100;
run('recordActivity("editor_key")');
clock = 350;
run('recordActivity("editor_key")');
assert.equal(last().since_last_editor_key_ms, 250);
const specialCode = '=formula\t"quoted"\\path\nprint("😀")\r\n';
context.specialCode = specialCode;
run('editor.value = specialCode; recordPlaybackSnapshot("Paste", true, "paste")');
assert.equal(last().change_insert, specialCode);
clock = 1000;
run('recordPlaybackSnapshot("Run Code", true); recordPlaybackSnapshot("Run Code", true)');
assert.equal(run('activityLog.events.filter(e => e.event_type === "run_code").length'), 2);
assert.equal(last().since_last_editor_key_ms, 650);
const count = run('activityLog.events.length');
run('recordPlaybackSnapshot("Typing", true); recordPlaybackSnapshot("Last Edit", true)');
assert.equal(run('activityLog.events.length'), count);
run('activityPlaybackActive = true; editor.value = "old code"; recordPlaybackSnapshot("Typing")');
assert.equal(run('activityLog.events.length'), count);
run('activityPlaybackActive = false; editor.value = "restored"; recordPlaybackSnapshot("Restored Revision", true)');
assert.equal(run('activityLog.code'), 'restored');
run('playbackHistory = []; editor.value = "new file"; recordPlaybackSnapshot("Load File", true)');
assert.equal(last().file_id, 2);
assert.equal(last().since_last_editor_key_ms, '');
for (let i = 0; i < 1100; i++) {
  context.i = i;
  run('editor.value = String(i); recordPlaybackSnapshot("Typing")');
}
assert.equal(run('playbackHistory.length'), 1000);
assert.ok(run('activityLog.events.length') > 1100);
const tsv = run('activityLog.toTSV()');
const rows = tsv.replace(/\n$/, '').split('\n').map(row => row.split('\t'));
assert.ok(rows.every(row => row.length === 19));
assert.equal(JSON.parse(rows.find(row => row[3] === 'paste')[13]), specialCode);
assert.equal(rows[0][15], 'code_end', 'ending code is always included');
assert.equal(rows[0].slice(16).join(','), 'frustration,feeling,challenge_feeling');
assert.ok(tsv.includes('# starter'), 'earlier code remains in the export');

// Download from playback uses the live code, not the revision on screen.
let downloadedBlob;
let clicked = false;
context.URL.createObjectURL = blob => { downloadedBlob = blob; return 'blob:test'; };
context.document.getElementById = () => ({ checked: true });
context.document.createElement = () => ({ click: () => { clicked = true; }, remove: () => {} });
context.document.body = { appendChild: () => {} };
run('activityPlaybackActive = true; originalCodeBeforePlayback = "live code"; editor.value = "old revision"; downloadActivityTSV()');
assert.ok(clicked);
assert.equal(last().event_type, 'export');
assert.equal(run('activityLog.code'), 'live code');
assert.ok((await downloadedBlob.text()).includes('"live code"'));
console.log('PASS: event timing, repeated runs, paste changes, playback exclusion, file boundaries, >1,000 edits, TSV round-trip, beginning/ending code, download.');

assert.equal(run('shouldRemindActivityDownload()'), false, 'export clears reminder');
run('recordActivity("page_hidden"); recordActivity("editor_key")');
assert.equal(run('shouldRemindActivityDownload()'), false, 'visibility and navigation keys do not re-arm reminder');
run('recordActivity("run_code")');
assert.equal(run('shouldRemindActivityDownload()'), true, 'running again re-arms reminder');
run('activityNavigationApproved = true');
assert.equal(run('shouldRemindActivityDownload()'), false, 'explicit leave bypasses activity warning');
run('activityNavigationApproved = false');
const noReminderContext = vm.createContext({ URLSearchParams, window: { location: { search: '?blank' } }, performance: { now: () => 0 }, document: { hidden: false } });
vm.runInContext(fs.readFileSync('pythoncopy-activity.js', 'utf8'), noReminderContext);
vm.runInContext(app.slice(app.indexOf('    const activityLog ='), app.indexOf('    // --- Turtle Graphics')), noReminderContext);
assert.equal(vm.runInContext('recordActivity("run_code", "print(1)"); shouldRemindActivityDownload()', noReminderContext), false);
console.log('PASS: URL switch opt-in, download clearing, re-arming, explicit leave, passive-event exclusion.');

// Reconstruct every revision, including Unicode, deletions, replacements and files.
const compact = run('new PythonCopyActivityLog()');
const expected = [];
const record = (code, newFile = false) => {
  compact.record('edit', code, { newFile });
  expected.push(code);
};
record('print("😀")\n', true);
record('print("😁")\n');
record('print("😁")\n# extra\ttext');
record('');
record('=formula\r\n"quoted"\t\\');
record('second file', true);
record('second FILE');
record('second FILE');
const exported = compact.toTSV().replace(/\n$/, '').split('\n').map(line => line.split('\t'));
let reconstructed = '';
let beginCount = 0;
let endCount = 0;
exported.slice(1).forEach((row, index) => {
  if (row[14] !== '') { reconstructed = JSON.parse(row[14]); beginCount++; }
  if (row[11] !== '') {
    const start = Number(row[11]);
    reconstructed = reconstructed.slice(0, start) + JSON.parse(row[13]) + reconstructed.slice(start + Number(row[12]));
  }
  assert.equal(reconstructed, expected[index]);
  if (row[15] !== '') { assert.equal(JSON.parse(row[15]), reconstructed); endCount++; }
});
assert.equal(beginCount, 2);
assert.equal(endCount, 2);
assert.ok(compact.events.slice(1).every(event => !Object.hasOwn(event, 'code_snapshot')));
const empty = run('new PythonCopyActivityLog()');
empty.record('initial', '', { newFile: true });
assert.ok(empty.toTSV().includes('""\t""'), 'empty beginning/end differ from missing cells');
const beforeExport = compact.events.length;
compact.toTSV(); compact.toTSV();
assert.equal(compact.events.length, beforeExport, 'exports do not accumulate full snapshots');
const large = run('new PythonCopyActivityLog()');
let largeCode = 'x'.repeat(10000);
large.record('initial', largeCode, { newFile: true });
for (let i = 0; i < 1000; i++) { largeCode += 'y'; large.record('edit', largeCode); }
const retainedText = large.events.reduce((n, event) => n + (event.code_begin?.length || 0) + event.change_insert.length, 0);
assert.equal(retainedText, 11000, 'activity events retain initial code plus inserted changes');
console.log('PASS: exact reconstruction, Unicode, empty files, per-file beginnings/endings, repeated exports, compact storage.');

// Test feelings, frustration scale, and challenge reflection
const feelingLog = run('new PythonCopyActivityLog()');
feelingLog.setFeeling('Excited');
feelingLog.record('initial_mood', '# start');
feelingLog.record('editor_key', '# start a');
assert.equal(feelingLog.events[0].feeling, 'Excited');
assert.equal(feelingLog.events[1].feeling, 'Excited');
assert.equal(feelingLog.events[0].frustration, '');

feelingLog.setFrustration('Moderately');
feelingLog.record('frustration_level', '# start a');
assert.equal(feelingLog.events[2].frustration, 'Moderately');
assert.equal(feelingLog.events[2].feeling, 'Excited');

feelingLog.setChallengeFeeling('Loved it - great challenge');
feelingLog.record('challenge_feeling', '# start a');
assert.equal(feelingLog.events[3].challenge_feeling, 'Loved it - great challenge');

const feelingTSV = feelingLog.toTSV();
const feelingRows = feelingTSV.replace(/\n$/, '').split('\n').map(r => r.split('\t'));
assert.equal(feelingRows[0][16], 'frustration');
assert.equal(feelingRows[0][17], 'feeling');
assert.equal(feelingRows[0][18], 'challenge_feeling');
assert.equal(feelingRows[3][16], 'Moderately');
assert.equal(feelingRows[3][17], 'Excited');
assert.equal(feelingRows[4][18], 'Loved it - great challenge');
console.log('PASS: feelings, frustration scale, and challenge reflection tracking in TSV.');

// Test minimal mode (&min=1) configuration
const minContext = vm.createContext({
  URLSearchParams,
  window: { location: { search: '?min=1&remindDownload=1' } },
  performance: { now: () => 0 },
  document: { hidden: false },
  Blob,
  setTimeout: () => {},
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} }
});
vm.runInContext(fs.readFileSync('pythoncopy-activity.js', 'utf8'), minContext);
vm.runInContext(app.slice(app.indexOf('    const activityLog ='), app.indexOf('    // --- Turtle Graphics')), minContext);
assert.equal(vm.runInContext('isMinimalMode', minContext), true);
assert.equal(vm.runInContext('activityReminderEnabled', minContext), false);

const trackingContext = vm.createContext({
  URLSearchParams,
  window: { location: { search: '?remindDownload=1' } },
  performance: { now: () => 0 },
  document: { hidden: false },
  Blob,
  setTimeout: () => {},
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} }
});
vm.runInContext(fs.readFileSync('pythoncopy-activity.js', 'utf8'), trackingContext);
vm.runInContext(app.slice(app.indexOf('    const activityLog ='), app.indexOf('    // --- Turtle Graphics')), trackingContext);
assert.equal(vm.runInContext('isMinimalMode', trackingContext), false);
assert.equal(vm.runInContext('activityReminderEnabled', trackingContext), true);
console.log('PASS: minimal mode (&min=1) suppresses mood and activity reminders while tracking mode preserves them.');

