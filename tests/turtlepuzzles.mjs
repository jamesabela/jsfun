import assert from 'node:assert/strict';
import engine from '../turtlepuzzles-engine.js';
import levelsData from '../turtlepuzzles-levels.js';

const { LEVELS, WORLDS } = levelsData;

assert.equal(WORLDS.length, 5, 'Should have 5 worlds');
assert.equal(LEVELS.length, 40, 'Should have 40 levels');

let failures = 0;

for (const level of LEVELS) {
  const res = engine.simulateLevel(level, level.referenceSolution);
  if (!res.ok) {
    console.error(`Level ${level.id} (${level.title}) FAILED to run:`, res.error || res.collision);
    failures++;
    continue;
  }
  if (!res.completed) {
    console.error(
      `Level ${level.id} (${level.title}) NOT COMPLETED:`,
      {
        gems: `${res.gemsCollected}/${res.totalGems}`,
        reachedFlag: res.reachedFlag,
        drawEval: res.drawEval,
        finalState: res.finalState
      }
    );
    failures++;
    continue;
  }
  if (res.stars < 3) {
    console.error(
      `Level ${level.id} (${level.title}) got ${res.stars} stars (expected 3): lines=${res.metrics.meaningfulLines}, threeStarLines=${level.threeStarLines}`
    );
    failures++;
    continue;
  }
}

// Test anti-cheat semicolon check
const cheatRes = engine.simulateLevel(LEVELS[0], 'turtle.forward(40); turtle.forward(40)');
assert.equal(cheatRes.ok, false, 'Semicolon multi-statement should be rejected');

// Test infinite loop / high step count guard
const infRes = engine.simulateLevel(LEVELS[16], 'for i in range(9999):\n    turtle.forward(1)');
assert.equal(infRes.ok, false, 'Excessive loop steps should be stopped');

// Test pattern detection
const pat = engine.detectRepeatedSequence('turtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)');
assert.ok(pat && pat.repeats === 3, 'Should detect 3 repeated forward commands');

assert.equal(failures, 0, `${failures} level(s) failed verification`);
console.log(`PASS: All ${LEVELS.length} levels verified with 3-star reference solutions!`);
