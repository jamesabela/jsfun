/**
 * Turtle Quest - Python Turtle Subset Parser, Interpreter & Level Evaluator
 * Works in both Browser (window.TurtleEngine) and Node.js (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TurtleEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MAX_EXECUTED_STEPS = 4000;
  const MAX_CALL_DEPTH = 32;

  const VALID_COLORS = new Set([
    'blue', 'red', 'green', 'purple', 'orange', 'gold', 'yellow',
    'pink', 'teal', 'cyan', 'magenta', 'black', 'white', 'brown', 'navy', 'lime'
  ]);

  /**
   * Count meaningful Python statements (excludes blanks, comments, import turtle).
   * Flags semicolons used to pack multiple statements on one line.
   */
  function analyzeCodeMetrics(code) {
    const lines = String(code || '').split(/\r?\n/);
    let meaningfulLines = 0;
    let hasMultiStatementLine = false;

    for (let i = 0; i < lines.length; i++) {
      const stripped = stripInlineComment(lines[i]).trim();
      if (!stripped) continue;
      if (/^import\s+turtle\s*$/.test(stripped)) continue;
      if (/^from\s+turtle\s+import\s+/.test(stripped)) continue;
      if (containsUnquotedSemicolon(stripped)) {
        hasMultiStatementLine = true;
      }
      meaningfulLines++;
    }

    return { meaningfulLines, hasMultiStatementLine };
  }

  function containsUnquotedSemicolon(str) {
    let quote = null;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        if (ch === '\\') { i++; continue; }
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === ';') return true;
      }
    }
    return false;
  }

  function stripInlineComment(line) {
    let quote = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quote) {
        if (ch === '\\') { i++; continue; }
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === '#') return line.slice(0, i);
      }
    }
    return line;
  }

  /**
   * Safely evaluate a simple numeric expression with current scope variables.
   */
  function evalNumericExpr(expr, scope) {
    const trimmed = expr.trim();
    if (!trimmed) throw new Error('Expected a number.');
    // Allow numbers, variable names, +, -, *, /, //, %, (, ), whitespace
    if (!/^[0-9a-zA-Z_+\-*/%().\s]+$/.test(trimmed)) {
      throw new Error(`Unsupported expression: ${trimmed}`);
    }
    // Replace identifiers with scope values
    const replaced = trimmed.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (m) => {
      if (Object.prototype.hasOwnProperty.call(scope, m)) {
        return String(Number(scope[m]));
      }
      throw new Error(`Unknown variable "${m}"`);
    });
    // Convert Python integer division // to Math.trunc(a/b) or simple safe recursive-descent parser
    return parseAddSub(replaced.replace(/\s+/g, ''));
  }

  function parseAddSub(s) {
    let idx = 0;
    function parseExpr() {
      let val = parseMulDiv();
      while (idx < s.length && (s[idx] === '+' || s[idx] === '-')) {
        const op = s[idx++];
        const rhs = parseMulDiv();
        val = op === '+' ? val + rhs : val - rhs;
      }
      return val;
    }
    function parseMulDiv() {
      let val = parseUnary();
      while (idx < s.length) {
        if (s[idx] === '*' ) {
          idx++;
          val *= parseUnary();
        } else if (s[idx] === '/' && s[idx + 1] === '/') {
          idx += 2;
          const rhs = parseUnary();
          if (rhs === 0) throw new Error('Division by zero');
          val = Math.trunc(val / rhs);
        } else if (s[idx] === '/') {
          idx++;
          const rhs = parseUnary();
          if (rhs === 0) throw new Error('Division by zero');
          val /= rhs;
        } else if (s[idx] === '%') {
          idx++;
          const rhs = parseUnary();
          if (rhs === 0) throw new Error('Modulo by zero');
          val %= rhs;
        } else {
          break;
        }
      }
      return val;
    }
    function parseUnary() {
      if (s[idx] === '-') { idx++; return -parseUnary(); }
      if (s[idx] === '+') { idx++; return parseUnary(); }
      return parsePrimary();
    }
    function parsePrimary() {
      if (s[idx] === '(') {
        idx++;
        const val = parseExpr();
        if (s[idx] !== ')') throw new Error('Mismatched parentheses');
        idx++;
        return val;
      }
      const match = s.slice(idx).match(/^\d+(\.\d+)?/);
      if (!match) throw new Error(`Invalid number in expression`);
      idx += match[0].length;
      return parseFloat(match[0]);
    }
    const result = parseExpr();
    if (idx !== s.length || !Number.isFinite(result)) {
      throw new Error('Invalid numeric expression');
    }
    return result;
  }

  function evalStringArg(expr) {
    const t = expr.trim();
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1).toLowerCase();
    }
    throw new Error(`Expected a quoted string like "blue", got ${t}`);
  }

  /**
   * Parse Python source code into an AST of statements.
   */
  function parsePython(code) {
    const rawLines = String(code || '').split(/\r?\n/);
    const tokens = [];

    for (let i = 0; i < rawLines.length; i++) {
      const lineNo = i + 1;
      const raw = rawLines[i];
      const noComment = stripInlineComment(raw);
      if (!noComment.trim()) continue;
      if (containsUnquotedSemicolon(noComment)) {
        throw { line: lineNo, message: 'Please put only one Python command per line (no semicolons).' };
      }
      const indentMatch = noComment.match(/^(\s*)/);
      const indentStr = indentMatch ? indentMatch[1] : '';
      if (indentStr.includes('\t')) {
        throw { line: lineNo, message: 'Use spaces (4 spaces) for indentation instead of tabs.' };
      }
      tokens.push({
        line: lineNo,
        indent: indentStr.length,
        text: noComment.trim()
      });
    }

    let pos = 0;

    function parseBlock(expectedIndent) {
      const stmts = [];
      while (pos < tokens.length) {
        const tok = tokens[pos];
        if (tok.indent < expectedIndent) {
          break;
        }
        if (tok.indent > expectedIndent) {
          throw { line: tok.line, message: `Unexpected indentation on line ${tok.line}.` };
        }
        pos++;
        const text = tok.text;

        if (/^import\s+turtle$/.test(text) || /^from\s+turtle\s+import\s+/.test(text)) {
          continue;
        }
        if (text === 'pass') {
          stmts.push({ type: 'pass', line: tok.line });
          continue;
        }

        // for <var> in range(...):
        const forMatch = text.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\((.+)\)\s*:$/);
        if (forMatch) {
          const varName = forMatch[1];
          const args = forMatch[2].split(',').map(a => a.trim()).filter(Boolean);
          if (args.length < 1 || args.length > 3) {
            throw { line: tok.line, message: `range() expects 1 to 3 arguments on line ${tok.line}.` };
          }
          if (pos >= tokens.length || tokens[pos].indent <= expectedIndent) {
            throw { line: tok.line, message: `The loop on line ${tok.line} has no commands inside it.` };
          }
          const bodyIndent = tokens[pos].indent;
          const body = parseBlock(bodyIndent);
          stmts.push({ type: 'for', varName, args, body, line: tok.line });
          continue;
        }

        // def <name>():
        const defMatch = text.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*:$/);
        if (defMatch) {
          const fnName = defMatch[1];
          if (pos >= tokens.length || tokens[pos].indent <= expectedIndent) {
            throw { line: tok.line, message: `The function "${fnName}" on line ${tok.line} has no commands inside it.` };
          }
          const bodyIndent = tokens[pos].indent;
          const body = parseBlock(bodyIndent);
          stmts.push({ type: 'def', name: fnName, body, line: tok.line });
          continue;
        }

        // turtle.<cmd>(<arg?>)
        const turtleMatch = text.match(/^turtle\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)$/);
        if (turtleMatch) {
          const cmd = turtleMatch[1];
          const arg = turtleMatch[2].trim();
          stmts.push({ type: 'turtle', cmd, arg, line: tok.line });
          continue;
        }

        // function call: <name>()
        const callMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)$/);
        if (callMatch) {
          stmts.push({ type: 'call', name: callMatch[1], line: tok.line });
          continue;
        }

        throw { line: tok.line, message: `Unrecognised command on line ${tok.line}: "${text}"` };
      }
      return stmts;
    }

    if (tokens.length > 0 && tokens[0].indent > 0) {
      throw { line: tokens[0].line, message: `Unexpected indentation on line ${tokens[0].line}.` };
    }

    return parseBlock(0);
  }

  /**
   * Flatten an AST execution into a list of concrete turtle steps (with line numbers)
   * up to MAX_EXECUTED_STEPS.
   */
  function compileSteps(ast) {
    const functions = Object.create(null);
    const steps = [];

    function execBlock(stmts, scope, depth) {
      if (depth > MAX_CALL_DEPTH) {
        throw { line: stmts[0] ? stmts[0].line : 1, message: 'Too many nested function calls (possible infinite recursion).' };
      }
      for (let i = 0; i < stmts.length; i++) {
        const s = stmts[i];
        if (s.type === 'pass') continue;
        if (s.type === 'def') {
          functions[s.name] = s.body;
          continue;
        }
        if (s.type === 'for') {
          let start = 0, stop = 0, step = 1;
          try {
            if (s.args.length === 1) {
              stop = Math.trunc(evalNumericExpr(s.args[0], scope));
            } else if (s.args.length === 2) {
              start = Math.trunc(evalNumericExpr(s.args[0], scope));
              stop = Math.trunc(evalNumericExpr(s.args[1], scope));
            } else {
              start = Math.trunc(evalNumericExpr(s.args[0], scope));
              stop = Math.trunc(evalNumericExpr(s.args[1], scope));
              step = Math.trunc(evalNumericExpr(s.args[2], scope));
            }
          } catch (err) {
            throw { line: s.line, message: `Line ${s.line}: ${err.message}` };
          }
          if (step === 0) {
            throw { line: s.line, message: `Line ${s.line}: range() step cannot be zero.` };
          }
          const prevHad = Object.prototype.hasOwnProperty.call(scope, s.varName);
          const prevVal = scope[s.varName];
          let iter = 0;
          for (let v = start; step > 0 ? v < stop : v > stop; v += step) {
            if (++iter > MAX_EXECUTED_STEPS || steps.length >= MAX_EXECUTED_STEPS) {
              throw { line: s.line, message: `Program stopped: exceeded ${MAX_EXECUTED_STEPS} steps (possible infinite loop).` };
            }
            scope[s.varName] = v;
            execBlock(s.body, scope, depth);
          }
          if (prevHad) scope[s.varName] = prevVal;
          else delete scope[s.varName];
          continue;
        }
        if (s.type === 'call') {
          const fnBody = functions[s.name];
          if (!fnBody) {
            throw { line: s.line, message: `Line ${s.line}: Function "${s.name}" is not defined yet.` };
          }
          steps.push({ kind: 'noop', line: s.line, label: `${s.name}()` });
          execBlock(fnBody, Object.create(scope), depth + 1);
          continue;
        }
        if (s.type === 'turtle') {
          if (steps.length >= MAX_EXECUTED_STEPS) {
            throw { line: s.line, message: `Program stopped: exceeded ${MAX_EXECUTED_STEPS} steps.` };
          }
          const step = resolveTurtleCommand(s, scope);
          steps.push(step);
        }
      }
    }

    function resolveTurtleCommand(s, scope) {
      const cmd = s.cmd;
      try {
        if (cmd === 'forward' || cmd === 'fd') {
          return { kind: 'move', dist: evalNumericExpr(s.arg, scope), line: s.line };
        }
        if (cmd === 'backward' || cmd === 'bk' || cmd === 'back') {
          return { kind: 'move', dist: -evalNumericExpr(s.arg, scope), line: s.line };
        }
        if (cmd === 'left' || cmd === 'lt') {
          return { kind: 'turn', angle: evalNumericExpr(s.arg, scope), line: s.line };
        }
        if (cmd === 'right' || cmd === 'rt') {
          return { kind: 'turn', angle: -evalNumericExpr(s.arg, scope), line: s.line };
        }
        if (cmd === 'penup' || cmd === 'pu' || cmd === 'up') {
          return { kind: 'pen', down: false, line: s.line };
        }
        if (cmd === 'pendown' || cmd === 'pd' || cmd === 'down') {
          return { kind: 'pen', down: true, line: s.line };
        }
        if (cmd === 'pencolor' || cmd === 'color') {
          const color = evalStringArg(s.arg);
          if (!VALID_COLORS.has(color) && !/^#[0-9a-f]{3,6}$/i.test(color)) {
            throw new Error(`Unknown colour "${color}"`);
          }
          return { kind: 'color', color, line: s.line };
        }
        if (cmd === 'speed' || cmd === 'pensize' || cmd === 'width') {
          const val = evalNumericExpr(s.arg, scope);
          return { kind: cmd === 'speed' ? 'noop' : 'width', width: val, line: s.line };
        }
      } catch (err) {
        throw { line: s.line, message: `Line ${s.line}: ${err.message}` };
      }
      throw { line: s.line, message: `Line ${s.line}: Unsupported turtle command "turtle.${cmd}".` };
    }

    execBlock(ast, Object.create(null), 0);
    return steps;
  }

  // --- Geometry helpers for collision & drawing ---

  function distPointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  /**
   * Segment vs AABB intersection using Liang-Barsky.
   * Returns earliest t in [0, 1] or null if no intersection.
   */
  function segmentIntersectsRect(x1, y1, x2, y2, rect, padding) {
    const minX = rect.x - padding;
    const maxX = rect.x + rect.w + padding;
    const minY = rect.y - padding;
    const maxY = rect.y + rect.h + padding;

    const dx = x2 - x1;
    const dy = y2 - y1;
    let t0 = 0;
    let t1 = 1;

    const checks = [
      [-dx, x1 - minX],
      [dx, maxX - x1],
      [-dy, y1 - minY],
      [dy, maxY - y1]
    ];

    for (let i = 0; i < 4; i++) {
      const p = checks[i][0];
      const q = checks[i][1];
      if (Math.abs(p) < 1e-9) {
        if (q < 0) return null;
      } else {
        const r = q / p;
        if (p < 0) {
          if (r > t1) return null;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) return null;
          if (r < t1) t1 = r;
        }
      }
    }
    return t0 <= t1 ? t0 : null;
  }

  function checkWallCollision(x1, y1, x2, y2, level) {
    const walls = level.walls || [];
    const halfW = (level.canvasWidth || 480) / 2 - 12;
    const halfH = (level.canvasHeight || 480) / 2 - 12;
    const pad = 7;

    let bestT = null;
    let hitReason = null;

    // Check walls
    for (let i = 0; i < walls.length; i++) {
      const t = segmentIntersectsRect(x1, y1, x2, y2, walls[i], pad);
      if (t !== null && (bestT === null || t < bestT)) {
        bestT = t;
        hitReason = 'wall';
      }
    }

    // Check outer bounds for maze levels (or any level with walls/flag)
    if (level.type === 'maze' || level.type === 'hybrid' || (walls.length > 0)) {
      if (x2 < -halfW || x2 > halfW || y2 < -halfH || y2 > halfH) {
        // Find t where it crosses boundary
        let bt = 1;
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (x2 < -halfW && dx !== 0) bt = Math.min(bt, (-halfW - x1) / dx);
        if (x2 > halfW && dx !== 0) bt = Math.min(bt, (halfW - x1) / dx);
        if (y2 < -halfH && dy !== 0) bt = Math.min(bt, (-halfH - y1) / dy);
        if (y2 > halfH && dy !== 0) bt = Math.min(bt, (halfH - y1) / dy);
        bt = Math.max(0, Math.min(1, bt));
        if (bestT === null || bt < bestT) {
          bestT = bt;
          hitReason = 'boundary';
        }
      }
    }

    if (bestT !== null) {
      return {
        hit: true,
        reason: hitReason,
        hitX: x1 + (x2 - x1) * bestT,
        hitY: y1 + (y2 - y1) * bestT
      };
    }
    return { hit: false };
  }

  /**
   * Evaluate drawn segments against targetSegments.
   */
  function evaluateDrawing(drawnLines, targetSegments, requireColors) {
    if (!targetSegments || targetSegments.length === 0) {
      return { passed: true, coverage: 1, accuracy: 1 };
    }
    if (!drawnLines || drawnLines.length === 0) {
      return { passed: false, coverage: 0, accuracy: 0 };
    }

    const tolerance = 11;
    const sampleStep = 6;

    function sampleSegments(segs) {
      const pts = [];
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
        const count = Math.max(2, Math.ceil(len / sampleStep));
        for (let k = 0; k <= count; k++) {
          const t = k / count;
          pts.push({
            x: s.x1 + (s.x2 - s.x1) * t,
            y: s.y1 + (s.y2 - s.y1) * t,
            color: s.color || null
          });
        }
      }
      return pts;
    }

    const targetPts = sampleSegments(targetSegments);
    let covered = 0;
    for (let i = 0; i < targetPts.length; i++) {
      const p = targetPts[i];
      let ok = false;
      for (let j = 0; j < drawnLines.length; j++) {
        const d = drawnLines[j];
        if (requireColors && p.color && d.color !== p.color) continue;
        if (distPointToSegment(p.x, p.y, d.x1, d.y1, d.x2, d.y2) <= tolerance) {
          ok = true;
          break;
        }
      }
      if (ok) covered++;
    }

    const drawnPts = sampleSegments(drawnLines);
    let accurate = 0;
    for (let i = 0; i < drawnPts.length; i++) {
      const p = drawnPts[i];
      let ok = false;
      for (let j = 0; j < targetSegments.length; j++) {
        const ts = targetSegments[j];
        if (requireColors && ts.color && p.color !== ts.color) continue;
        if (distPointToSegment(p.x, p.y, ts.x1, ts.y1, ts.x2, ts.y2) <= tolerance) {
          ok = true;
          break;
        }
      }
      if (ok) accurate++;
    }

    const coverage = covered / targetPts.length;
    const accuracy = accurate / drawnPts.length;
    const passed = coverage >= 0.92 && accuracy >= 0.88;
    return { passed, coverage, accuracy };
  }

  /**
   * Run a full simulation synchronously (for verification & testing).
   */
  function simulateLevel(level, code) {
    const metrics = analyzeCodeMetrics(code);
    if (metrics.hasMultiStatementLine) {
      return {
        ok: false,
        error: { line: 1, message: 'Multiple commands on one line are not allowed.' },
        metrics
      };
    }

    let ast, steps;
    try {
      ast = parsePython(code);
      steps = compileSteps(ast);
    } catch (err) {
      return { ok: false, error: err, metrics };
    }

    let x = level.start.x;
    let y = level.start.y;
    let heading = level.start.heading;
    let penDown = level.start.penDown !== undefined ? level.start.penDown : true;
    let color = level.start.color || 'blue';
    let width = 3;

    const gems = (level.gems || []).map((g, idx) => ({ ...g, id: idx, collected: false }));
    const drawnLines = [];
    let executedTurtleOps = 0;

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      if (st.kind === 'noop') continue;
      executedTurtleOps++;

      if (st.kind === 'turn') {
        heading = ((heading + st.angle) % 360 + 360) % 360;
      } else if (st.kind === 'pen') {
        penDown = st.down;
      } else if (st.kind === 'color') {
        color = st.color;
      } else if (st.kind === 'width') {
        width = st.width;
      } else if (st.kind === 'move') {
        const rad = (heading * Math.PI) / 180;
        const nx = x + st.dist * Math.cos(rad);
        const ny = y + st.dist * Math.sin(rad);

        const col = checkWallCollision(x, y, nx, ny, level);
        if (col.hit) {
          return {
            ok: false,
            collision: { line: st.line, x: col.hitX, y: col.hitY, reason: col.reason },
            metrics,
            executedTurtleOps,
            drawnLines,
            gemsCollected: gems.filter(g => g.collected).length
          };
        }

        for (let g = 0; g < gems.length; g++) {
          if (!gems[g].collected && distPointToSegment(gems[g].x, gems[g].y, x, y, nx, ny) <= 20) {
            gems[g].collected = true;
          }
        }

        if (penDown && Math.abs(st.dist) > 0.01) {
          drawnLines.push({ x1: x, y1: y, x2: nx, y2: ny, color, width });
        }

        x = nx;
        y = ny;
      }
    }

    const gemsCollected = gems.filter(g => g.collected).length;
    const allGemsCollected = gemsCollected === gems.length;
    const reachedFlag = !level.flag || Math.hypot(x - level.flag.x, y - level.flag.y) <= 20;
    const drawEval = level.targetDrawing
      ? evaluateDrawing(drawnLines, level.targetDrawing, Boolean(level.requireColors))
      : { passed: true, coverage: 1, accuracy: 1 };

    const completed = allGemsCollected && reachedFlag && drawEval.passed;
    let stars = 0;
    if (completed) {
      stars = 1;
      if (metrics.meaningfulLines <= level.targetLines) stars = 2;
      if (metrics.meaningfulLines <= level.threeStarLines) stars = 3;
    }

    return {
      ok: true,
      completed,
      stars,
      metrics,
      executedTurtleOps,
      gemsCollected,
      totalGems: gems.length,
      reachedFlag,
      drawEval,
      finalState: { x, y, heading, penDown, color },
      drawnLines
    };
  }

  /**
   * Detect consecutive repeated command sequences (for loop suggestion).
   */
  function detectRepeatedSequence(code) {
    const lines = String(code || '').split(/\r?\n/)
      .map(l => stripInlineComment(l).trim())
      .filter(l => l && !/^import\s+turtle$/.test(l));

    // Look for pattern of length 1..4 repeated >= 3 times consecutively
    for (let patLen = 1; patLen <= 4; patLen++) {
      for (let start = 0; start + patLen * 3 <= lines.length; start++) {
        const pat = lines.slice(start, start + patLen);
        if (pat.some(p => p.startsWith('for ') || p.startsWith('def '))) continue;
        let repeats = 1;
        while (start + (repeats + 1) * patLen <= lines.length) {
          let match = true;
          for (let k = 0; k < patLen; k++) {
            if (lines[start + repeats * patLen + k] !== pat[k]) {
              match = false;
              break;
            }
          }
          if (!match) break;
          repeats++;
        }
        if (repeats >= 3) {
          return { pattern: pat, repeats };
        }
      }
    }
    return null;
  }

  return {
    MAX_EXECUTED_STEPS,
    VALID_COLORS,
    analyzeCodeMetrics,
    parsePython,
    compileSteps,
    checkWallCollision,
    distPointToSegment,
    evaluateDrawing,
    simulateLevel,
    detectRepeatedSequence
  };
}));
